/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { EventEmitter } from 'events';
import Long from 'long';
import path from 'path';
import { load, Root } from 'protobuf-typescript';
import * as tls from 'tls';

import { Message, MessageTag } from './fid.model';
import { PushClientParser } from './push-client-parser.service';

export class PushClient extends EventEmitter {
  private readonly HOST = 'mtalk.google.com';
  private readonly PORT = 5228;

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

  public connect(callback: (msg: any) => void): void {
    this.callback = callback;
    this.pushClientParser.on('message', (message) => this.handleParsedMessage(message));

    const client = tls.connect(this.PORT, this.HOST, {
      rejectUnauthorized: false,
    });
    client.setKeepAlive(true);

    client.on('connect', () => this.onSocketConnect());
    client.on('close', () => this.onSocketClose());
    client.on('error', (error) => this.onSocketError(error));

    client.on('data', (newData) => this.onSocketData(newData));
    client.write(this.buildLoginRequest());
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
      receivedPersistentId: [],
    };

    const errorMessage = LoginRequestType.verify(loginRequest);
    if (errorMessage) {
      throw new Error(errorMessage);
    }

    const buffer = LoginRequestType.encodeDelimited(loginRequest).finish();
    return Buffer.concat([Buffer.from([41, 2]), buffer]);
  }

  private onSocketData(newData: Buffer) {
    this.pushClientParser.handleData(newData);
  }

  private onSocketConnect() {
    this.emit('connect');
  }

  private onSocketClose() {
    console.log('onSocketClose');
    this.emit('disconnect');
  }

  private onSocketError(error: any) {
    console.log('onSocketError: ', error);
  }

  private handleParsedMessage(message: Message) {
    if (message.tag === MessageTag.LoginResponse) {
      console.log('GCM -> logged in -> waiting for push messages!');
    } else {
      this.handleParsedDataMessage(message);
    }
  }

  private handleParsedDataMessage(message: Message) {
    if (message.tag === MessageTag.DataMessageStanza) {
      if (!!this.callback) {
        this.callback(this.convertPayloadMessage(message));
      }
    }
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
}
