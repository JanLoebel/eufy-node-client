import { Credentials } from 'push-receiver';
import { listen as pushReceiverListen } from 'push-receiver';
import { GCMCredentials, register as registerGCM } from 'push-receiver/src/gcm';
import registerFCM from 'push-receiver/src/fcm';
import { FCMEufyPushMessage, PushMessage } from './push.model';

export class PushService {
  private readonly APP_ID = `1:970832592257:android:49786eca9d117e162d7c80`;
  private readonly APP_SENDER_ID = '348804314802';

  public async createPushCredentials(): Promise<Credentials> {
    const gcmCredentials: GCMCredentials = await registerGCM(this.APP_ID);
    const fcmCredentials = await registerFCM({
      token: gcmCredentials.token,
      senderId: this.APP_SENDER_ID,
      appId: this.APP_ID,
    });
    return {
      ...fcmCredentials,
      gcm: gcmCredentials,
    };
  }

  public listen(credentials: Credentials, callback: (msg: PushMessage) => void): void {
    pushReceiverListen(credentials, (msg: FCMEufyPushMessage) => {
      const payload = JSON.parse(Buffer.from(msg.notification.data.payload, 'base64').toString());
      callback({
        orgMsg: msg,
        data: {
          ...msg.notification.data,
          payload,
        },
      });
    });
  }
}
