/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { EventEmitter } from 'events';
import { BufferReader, load, Root } from 'protobuf-typescript';

export enum ProcessingState {
  MCS_VERSION_TAG_AND_SIZE = 0,
  MCS_TAG_AND_SIZE = 1,
  MCS_SIZE = 2,
  MCS_PROTO_BYTES = 3,
}

export enum MessageTag {
  kHeartbeatPingTag = 0,
  kHeartbeatAckTag = 1,
  kLoginRequestTag = 2,
  kLoginResponseTag = 3,
  kCloseTag = 4,
  kMessageStanzaTag = 5,
  kPresenceStanzaTag = 6,
  kIqStanzaTag = 7,
  kDataMessageStanzaTag = 8,
  kBatchPresenceStanzaTag = 9,
  kStreamErrorStanzaTag = 10,
  kHttpRequestTag = 11,
  kHttpResponseTag = 12,
  kBindAccountRequestTag = 13,
  kBindAccountResponseTag = 14,
  kTalkMetadataTag = 15,
  kNumProtoTypes = 16,
}

export class Parser extends EventEmitter {
  private static proto: Root | null = null;

  private state: ProcessingState = ProcessingState.MCS_VERSION_TAG_AND_SIZE;
  private data: Buffer = Buffer.alloc(0);
  private isWaitingForData = true;
  private sizePacketSoFar = 0;
  private messageSize = 0;
  private messageTag = 0;
  private handshakeComplete = false;

  private constructor() {
    super();
  }

  public static async init(): Promise<Parser> {
    this.proto = await load('mcs.proto');
    return new Parser();
  }

  handleData(newData: Buffer): void {
    this.data = Buffer.concat([this.data, newData]);
    if (this.isWaitingForData) {
      this.isWaitingForData = false;
      this.waitForData();
    }
  }

  private waitForData(): void {
    const minBytesNeeded = this.getMinBytesNeeded();

    // If we don't have all bytes yet, wait some more
    if (this.data.length < minBytesNeeded) {
      this.isWaitingForData = true;
      return;
    } else {
      this.handleFullMessage();
    }
  }

  private handleFullMessage() {
    switch (this.state) {
      case ProcessingState.MCS_VERSION_TAG_AND_SIZE:
        this.onGotVersion();
        break;
      case ProcessingState.MCS_TAG_AND_SIZE:
        this.onGotMessageTag();
        break;
      case ProcessingState.MCS_SIZE:
        this.onGotMessageSize();
        break;
      case ProcessingState.MCS_PROTO_BYTES:
        this.onGotMessageBytes();
        break;
    }
  }

  private onGotVersion(): void {
    const version = this.data.readInt8(0);
    this.data = this.data.slice(1);
    if (version < 41 && version !== 38) {
      throw new Error(`Got wrong version: ${version}`);
    }

    // Process the LoginResponse message tag.
    this.onGotMessageTag();
  }

  private onGotMessageTag(): void {
    this.messageTag = this.data.readInt8(0);
    this.data = this.data.slice(1);
    this.onGotMessageSize();
  }

  private onGotMessageSize(): void {
    let incompleteSizePacket = false;
    const reader = new BufferReader(this.data);

    try {
      this.messageSize = reader.int32();
    } catch (error) {
      if (error.message.startsWith('index out of range:')) {
        incompleteSizePacket = true;
      } else {
        throw new Error(error);
      }
    }

    if (incompleteSizePacket) {
      this.sizePacketSoFar = reader.pos;
      this.state = ProcessingState.MCS_SIZE;
      this.waitForData();
      return;
    }

    this.data = this.data.slice(reader.pos);
    this.sizePacketSoFar = 0;

    if (this.messageSize > 0) {
      this.state = ProcessingState.MCS_PROTO_BYTES;
      this.waitForData();
    } else {
      this.onGotMessageBytes();
    }
  }

  private onGotMessageBytes(): void {
    const protobuf = this.buildProtobufFromTag(this.messageTag);
    if (!protobuf) {
      throw new Error('Unknown tag');
    }

    if (this.messageSize === 0) {
      this.emit('message', { tag: this.messageTag, object: {} });
      this.getNextMessage();
      return;
    }

    if (this.data.length < this.messageSize) {
      this.state = ProcessingState.MCS_PROTO_BYTES;
      this.waitForData();
      return;
    }

    const buffer = this.data.slice(0, this.messageSize);
    this.data = this.data.slice(this.messageSize);
    const message = protobuf.decode(buffer);
    const object = protobuf.toObject(message, {
      longs: String,
      enums: String,
      bytes: Buffer,
    });

    this.emit('message', { tag: this.messageTag, object: object });

    if (this.messageTag === MessageTag.kLoginResponseTag) {
      if (this.handshakeComplete) {
        console.error('Unexpected login response');
      } else {
        this.handshakeComplete = true;
      }
    }

    this.getNextMessage();
  }

  private getNextMessage() {
    this.messageTag = 0;
    this.messageSize = 0;
    this.state = ProcessingState.MCS_TAG_AND_SIZE;
    this.waitForData();
  }

  private getMinBytesNeeded(): number {
    switch (this.state) {
      case ProcessingState.MCS_VERSION_TAG_AND_SIZE:
        return 1 + 1 + 1;
      case ProcessingState.MCS_TAG_AND_SIZE:
        return 1 + 1;
      case ProcessingState.MCS_SIZE:
        return this.sizePacketSoFar + 1;
      case ProcessingState.MCS_PROTO_BYTES:
        return this.messageSize;
    }

    throw new Error(`Unknown state: ${this.state}`);
  }

  private buildProtobufFromTag(messageTag: number) {
    switch (messageTag) {
      case MessageTag.kHeartbeatPingTag:
        return Parser.proto!.lookupType('mcs_proto.HeartbeatPing');
      case MessageTag.kHeartbeatAckTag:
        return Parser.proto!.lookupType('mcs_proto.HeartbeatAck');
      case MessageTag.kLoginRequestTag:
        return Parser.proto!.lookupType('mcs_proto.LoginRequest');
      case MessageTag.kLoginResponseTag:
        return Parser.proto!.lookupType('mcs_proto.LoginResponse');
      case MessageTag.kCloseTag:
        return Parser.proto!.lookupType('mcs_proto.Close');
      case MessageTag.kIqStanzaTag:
        return Parser.proto!.lookupType('mcs_proto.IqStanza');
      case MessageTag.kDataMessageStanzaTag:
        return Parser.proto!.lookupType('mcs_proto.DataMessageStanza');
      case MessageTag.kStreamErrorStanzaTag:
        return Parser.proto!.lookupType('mcs_proto.StreamErrorStanza');
      default:
        return null;
    }
  }
}
