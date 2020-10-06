import { createSocket, Socket, RemoteInfo } from 'dgram';
import { sendMessage, hasHeader, RequestMessageType, ResponseMessageType } from './message.utils';
import { buildLookupWithKeyPayload } from './payload.utils';
import { Address } from './models';
import { promiseAny } from '../http/http.utils';

export class CloudLookupService {
  private readonly addressTimeoutInMs = 3 * 1000;
  private addresses: Array<Address> = [
    { host: '54.223.148.206', port: 32100 },
    { host: '18.197.212.165', port: 32100 },
    { host: '13.251.222.7', port: 32100 },
  ];

  private async bind(socket: Socket): Promise<void> {
    return new Promise((resolve) => {
      socket.bind(0, () => resolve());
    });
  }

  private async close(socket: Socket): Promise<void> {
    return new Promise((resolve) => {
      socket.close(() => resolve());
    });
  }

  public async lookup(p2pDid: string, dskKey: string): Promise<Array<Address>> {
    return promiseAny(this.addresses.map((address) => this.lookupByAddress(address, p2pDid, dskKey)));
  }

  private async lookupByAddress(address: Address, p2pDid: string, dskKey: string): Promise<Array<Address>> {
    return new Promise(async (resolve, reject) => {
      let timer: NodeJS.Timeout | null = null;

      const socket = createSocket('udp4');
      socket.on('error', (error: Error) => reject(error));
      await this.bind(socket); // Bind to a random port

      // Register listener
      const addresses: Array<Address> = [];
      socket.on('message', (msg: Buffer, rInfo: RemoteInfo) => {
        if (hasHeader(msg, ResponseMessageType.LOOKUP_ADDR)) {
          const port = msg[7] * 256 + msg[6];
          const ip = `${msg[11]}.${msg[10]}.${msg[9]}.${msg[8]}`;
          addresses.push({ host: ip, port: port });
          if (addresses.length === 2) {
            if (!!timer) {
              clearTimeout(timer);
            }
            this.close(socket);
            resolve(addresses);
          }
        }
      });

      // Send lookup message
      const msgId = RequestMessageType.LOOKUP_WITH_DSK;
      const payload = buildLookupWithKeyPayload(socket, p2pDid, dskKey);
      await sendMessage(socket, address, msgId, payload);
      timer = setTimeout(() => {
        this.close(socket);
        reject(`Timeout on address: ${JSON.stringify(address)}`);
      }, this.addressTimeoutInMs);
    });
  }
}
