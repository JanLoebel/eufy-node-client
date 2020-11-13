/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { EventEmitter } from 'events';
import Long from 'long';
import path from 'path';
import { load, Root } from 'protobuf-typescript';
import * as tls from 'tls';
import { LOG } from '../utils/logging';

import { Message, MessageTag } from './fid.model';
import { PushClientParser } from './push-client-parser.service';

export class PushClient extends EventEmitter {
  private readonly HOST = 'mtalk.google.com';
  private readonly PORT = 5228;
  private readonly MCS_VERSION = 41;
  private readonly HEARTBEAT_INTERVAL = 5 * 60 * 1000;

  private loggedIn = false;
  private streamId = 0;
  private lastStreamIdReported = -1;
  private currentDelay = 0;
  private client?: tls.TLSSocket;
  private heartbeatTimeout?: NodeJS.Timeout;
  private reconnectTimeout?: NodeJS.Timeout;
  private persistentIds: Array<string> = [];

  private static proto: Root | null = null;
  private callback: ((msg: any) => void) | null = null;

  private constructor(
    private pushClientParser: PushClientParser,
    private auth: { androidId: string; securityToken: string },
  ) {
    super();
  }

  public static async init(auth: { androidId: string; securityToken: string }): Promise<PushClient> {
    this.proto = await load(path.join(__dirname, 'mcs.proto'));
    const pushClientParser = await PushClientParser.init();
    return new PushClient(pushClientParser, auth);
  }

  private initialize() {
    this.loggedIn = false;
    this.streamId = 0;
    this.lastStreamIdReported = -1;

    if (this.client) {
      this.client.removeAllListeners();
      this.client.destroy();
      this.client = undefined;
    }
    this.pushClientParser.resetState();

    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = undefined;
    }
  }

  public setPersistentIds(ids: Array<string>): void {
    this.persistentIds = ids;
  }

  public connect(callback?: (msg: any) => void, persistentIds?: Array<string>): void {
    if (!!persistentIds) {
      this.setPersistentIds(persistentIds);
    }

    this.initialize();

    if (callback) this.callback = callback;
    this.pushClientParser.on('message', (message) => this.handleParsedMessage(message));

    this.client = tls.connect(this.PORT, this.HOST, {
      rejectUnauthorized: false,
    });
    this.client.setKeepAlive(true);
    // For debugging purposes
    //this.client.enableTrace();

    this.client.on('connect', () => this.onSocketConnect());
    this.client.on('close', () => this.onSocketClose());
    this.client.on('error', (error: any) => this.onSocketError(error));

    this.client.on('data', (newData: any) => this.onSocketData(newData));
    this.client.write(this.buildLoginRequest());
  }

  public updateCallback(callback: (msg: any) => void): void {
    this.callback = callback;
  }

  private buildLoginRequest(): Buffer {
    const androidId = this.auth.androidId;
    const securityToken = this.auth.securityToken;

    const LoginRequestType = PushClient.proto!.lookupType('mcs_proto.LoginRequest');
    const hexAndroidId = Long.fromString(androidId).toString(16);
    const loginRequest = {
      adaptiveHeartbeat: false,
      authService: 2,
      authToken: securityToken,
      id: 'chrome-63.0.3234.0',
      domain: 'mcs.android.com',
      deviceId: `android-${hexAndroidId}`,
      networkType: 1,
      resource: androidId,
      user: androidId,
      useRmq2: true,
      setting: [{ name: 'new_vc', value: '1' }],
      clientEvent: [],
      receivedPersistentId: this.persistentIds,
    };

    const errorMessage = LoginRequestType.verify(loginRequest);
    if (errorMessage) {
      throw new Error(errorMessage);
    }

    const buffer = LoginRequestType.encodeDelimited(loginRequest).finish();
    return Buffer.concat([Buffer.from([this.MCS_VERSION, MessageTag.LoginRequest]), buffer]);
  }

  private buildHeartbeatPingRequest(stream_id: number | undefined): Buffer {
    const heartbeatPingRequest: Record<string, any> = {};
    if (stream_id) {
      heartbeatPingRequest.last_stream_id_received = stream_id;
    }

    LOG('buildHeartbeatPingRequest: heartbeatPingRequest: ', JSON.stringify(heartbeatPingRequest));
    const HeartbeatPingRequestType = PushClient.proto!.lookupType('mcs_proto.HeartbeatPing');
    const errorMessage = HeartbeatPingRequestType.verify(heartbeatPingRequest);
    if (errorMessage) {
      throw new Error(errorMessage);
    }

    const buffer = HeartbeatPingRequestType.encodeDelimited(heartbeatPingRequest).finish();
    return Buffer.concat([Buffer.from([MessageTag.HeartbeatPing]), buffer]);
  }

  private buildHeartbeatAckRequest(stream_id?: number, status?: number): Buffer {
    const heartbeatAckRequest: Record<string, any> = {};
    if (stream_id && !status) {
      heartbeatAckRequest.last_stream_id_received = stream_id;
    } else if (!stream_id && status) {
      heartbeatAckRequest.status = status;
    } else {
      heartbeatAckRequest.last_stream_id_received = stream_id;
      heartbeatAckRequest.status = status;
    }
    LOG('buildHeartbeatAckRequest: heartbeatAckRequest: ', JSON.stringify(heartbeatAckRequest));

    const HeartbeatAckRequestType = PushClient.proto!.lookupType('mcs_proto.HeartbeatAck');
    const errorMessage = HeartbeatAckRequestType.verify(heartbeatAckRequest);
    if (errorMessage) {
      throw new Error(errorMessage);
    }

    const buffer = HeartbeatAckRequestType.encodeDelimited(heartbeatAckRequest).finish();
    return Buffer.concat([Buffer.from([MessageTag.HeartbeatAck]), buffer]);
  }

  private onSocketData(newData: Buffer) {
    this.pushClientParser.handleData(newData);
  }

  private onSocketConnect() {
    this.emit('connect');
  }

  private onSocketClose() {
    LOG('onSocketClose');
    this.loggedIn = false;
    if (this.heartbeatTimeout) clearTimeout(this.heartbeatTimeout);
    this.scheduleReconnect();

    this.emit('disconnect');
  }

  private onSocketError(error: any) {
    console.error('onSocketError: ', error);
  }

  private handleParsedMessage(message: Message) {
    this.resetCurrentDelay();
    switch (message.tag) {
      case MessageTag.DataMessageStanza:
        LOG('handleParsedMessage: DataMessageStanza: message: ', JSON.stringify(message));
        if (message.object && message.object.persistentId) this.persistentIds.push(message.object.persistentId);
        if (!!this.callback) {
          this.callback(this.convertPayloadMessage(message));
        }
        break;
      case MessageTag.HeartbeatPing:
        this.handleHeartbeatPing(message);
        break;
      case MessageTag.HeartbeatAck:
        this.handleHeartbeatAck(message);
        break;
      case MessageTag.Close:
        LOG('handleParsedMessage: Close: Server requested close! message: ', JSON.stringify(message));
        break;
      case MessageTag.LoginResponse:
        LOG('handleParsedMessage: Login response: GCM -> logged in -> waiting for push messages!');
        this.loggedIn = true;
        this.persistentIds = [];

        this.heartbeatTimeout = setTimeout(() => {
          this.scheduleHeartbeat(this);
        }, this.HEARTBEAT_INTERVAL);
        break;
      case MessageTag.LoginRequest:
        LOG('handleParsedMessage: Login request: message: ', JSON.stringify(message));
        break;
      case MessageTag.IqStanza:
        LOG('handleParsedMessage: IqStanza: Not implemented! - message: ', JSON.stringify(message));
        break;
      default:
        LOG('handleParsedMessage: Unknown message: ', JSON.stringify(message));
        return;
    }
    this.streamId++;
  }

  private handleHeartbeatPing(message: Message) {
    LOG('handleHeartbeatPing: message: ', JSON.stringify(message));
    let streamId = undefined;
    let status = undefined;
    if (this.newStreamIdAvailable()) {
      streamId = this.getStreamId();
    }
    if (message.object && message.object.status) {
      //TODO: Check if correctly implemented
      status = message.object.status;
    }
    if (this.client) this.client.write(this.buildHeartbeatAckRequest(streamId, status));
  }

  private handleHeartbeatAck(message: Message) {
    LOG('handleHeartbeatAck: message: ', JSON.stringify(message));
  }

  private convertPayloadMessage(message: Message) {
    const { appData, ...otherData } = message.object;
    const messageData: Record<string, any> = {};
    appData.forEach((kv: { key: string; value: any }) => {
      if (kv.key === 'payload') {
        const payload = JSON.parse(Buffer.from(kv.value, 'base64').toString('utf-8'));
        messageData[kv.key] = payload;
      } else {
        messageData[kv.key] = kv.value;
      }
    });

    return {
      ...otherData,
      payload: messageData,
    };
  }

  private getStreamId(): number {
    this.lastStreamIdReported = this.streamId;
    return this.streamId;
  }

  private newStreamIdAvailable(): boolean {
    return this.lastStreamIdReported != this.streamId;
  }

  private scheduleHeartbeat(client: PushClient): void {
    if (client.sendHeartbeat()) {
      this.heartbeatTimeout = setTimeout(() => {
        this.scheduleHeartbeat(client);
      }, client.HEARTBEAT_INTERVAL);
    } else {
      LOG('scheduleHeartbeat: disabled!');
    }
  }

  private sendHeartbeat(): boolean {
    let streamId = undefined;
    const status = undefined;
    if (this.newStreamIdAvailable()) {
      streamId = this.getStreamId();
    }

    if (this.client && this.isConnected()) {
      LOG('sendHeartbeat: streamId: ', streamId);
      this.client.write(this.buildHeartbeatPingRequest(streamId));
      return true;
    } else {
      LOG('sendHeartbeat: No more connected, reconnect');
      this.scheduleReconnect();
    }
    return false;
  }

  public isConnected(): boolean {
    return this.loggedIn;
  }

  private getCurrentDelay(): number {
    const delay = this.currentDelay == 0 ? 5000 : this.currentDelay;
    if (this.currentDelay < 60000) this.currentDelay += 10000;
    if (this.currentDelay >= 60000 && this.currentDelay < 600000) this.currentDelay += 60000;
    return delay;
  }

  private resetCurrentDelay(): void {
    this.currentDelay = 0;
  }

  private scheduleReconnect(): void {
    const delay = this.getCurrentDelay();
    LOG('scheduleReconnect: delay: ', delay);
    if (!this.reconnectTimeout)
      this.reconnectTimeout = setTimeout(() => {
        this.connect();
      }, delay);
  }
}
