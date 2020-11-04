/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { EventEmitter } from 'events';
import Long from 'long';
import { load, Root } from 'protobuf-typescript';

import * as tls from 'tls';
import { Message } from './fid.model';
import { MessageTag, Parser } from './parser.service';

export class PushClient extends EventEmitter {
  private readonly HOST = 'mtalk.google.com';
  private readonly PORT = 5228;

  private static proto: Root | null = null;

  private constructor(private parser: Parser, private auth: { androidId: string; securityToken: string }) {
    super();
  }

  public static async init(auth: { androidId: string; securityToken: string }): Promise<PushClient> {
    this.proto = await load('mcs.proto');
    const parser = await Parser.init();
    return new PushClient(parser, auth);
  }

  public connect(): void {
    this.parser.on('message', (message) => this.handleParsedMessage(message));

    const client = tls.connect(this.PORT, this.HOST, {
      rejectUnauthorized: false,
    });
    client.setKeepAlive(true);

    client.on('connect', () => this.onSocketConnect());
    client.on('close', () => this.onSocketClose());
    client.on('error', () => this.onSocketError());

    client.on('data', (newData) => this.onSocketData(newData));
    client.write(this.buildLoginRequest());
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
    this.parser.handleData(newData);
  }

  private onSocketConnect() {
    this.emit('connect');
  }

  private onSocketClose() {
    console.log('onSocketClose');
    this.emit('disconnect');
  }

  private onSocketError() {
    console.log('onSocketError');
  }

  private handleParsedMessage(message: Message) {
    if (message.tag === MessageTag.kLoginResponseTag) {
      console.log('GCM -> logged in -> waiting for push messages!');
    } else {
      this.handleParsedDataMessage(message);
    }
  }

  private handleParsedDataMessage(message: Message) {
    if (message.tag === MessageTag.kDataMessageStanzaTag) {
      console.log('Got message:', JSON.stringify(message));
    }
  }
}
