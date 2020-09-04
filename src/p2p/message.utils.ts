import { Socket } from 'dgram';

export class RequestMessageType {
  public static readonly LOOKUP_WITH_DSK = Buffer.from([0xf1, 0x26]);
  public static readonly LOCAL_LOOKUP = Buffer.from([0xf1, 0x30]);
  public static readonly CHECK_CAM = Buffer.from([0xf1, 0x41]);
  public static readonly PING = Buffer.from([0xf1, 0xe0]);
  public static readonly PONG = Buffer.from([0xf1, 0xe1]);
  public static readonly DATA = Buffer.from([0xf1, 0xd0]);
  public static readonly ACK = Buffer.from([0xf1, 0xd1]);
}

export class ResponseMessageType {
  public static readonly STUN = Buffer.from([0xf1, 0x01]);
  public static readonly LOOKUP_RESP = Buffer.from([0xf1, 0x21]);
  public static readonly LOOKUP_ADDR = Buffer.from([0xf1, 0x40]);
  public static readonly LOCAL_LOOKUP_RESP = Buffer.from([0xf1, 0x41]);
  public static readonly END = Buffer.from([0xf1, 0xf0]);
  public static readonly PONG = Buffer.from([0xf1, 0xe1]);
  public static readonly PING = Buffer.from([0xf1, 0xe0]);
  public static readonly CAM_ID = Buffer.from([0xf1, 0x42]);
  public static readonly ACK = Buffer.from([0xf1, 0xd1]);
  public static readonly DATA = Buffer.from([0xf1, 0xd0]);
}

export const sendMessage = async (
  socket: Socket,
  address: { host: string; port: number },
  msgID: Buffer,
  payload?: Buffer,
): Promise<number> => {
  if (!payload) payload = Buffer.from([]);
  const payloadLen = Buffer.from([Math.floor(payload.length / 256), payload.length % 256]);
  const message = Buffer.concat([msgID, payloadLen, payload], 4 + payload.length);

  return sendPackage(socket, address, message);
};

const sendPackage = async (socket: Socket, address: { host: string; port: number }, pkg: Buffer): Promise<number> => {
  return new Promise((resolve, reject) => {
    socket.send(pkg, address.port, address.host, (err, bytes) => {
      return err ? reject(err) : resolve(bytes);
    });
  });
};

export const hasHeader = (msg: Buffer, searchedType: Buffer): boolean => {
  const header = Buffer.allocUnsafe(2);
  msg.copy(header, 0, 0, 2);
  return Buffer.compare(header, searchedType) === 0;
};
