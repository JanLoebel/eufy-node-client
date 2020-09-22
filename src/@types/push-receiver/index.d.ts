declare module 'push-receiver' {
  export interface Credentials {
    keys: {
      privateKey: string;
      publicKey: string;
      authSecret: string;
    };

    fcm: {
      token: string;
      pushSet: string;
    };

    gcm: {
      token: string;
      androidId: string;
      securityToken: string;
      appId: string;
    };
  }

  export function register(senderId: string): Credentials;

  export function listen(credentials: Credentials, callback: (msg: any) => void): void;
}

declare module 'push-receiver/src/gcm' {
  export interface GCMCredentials {
    token: string;
    androidId: string;
    securityToken: string;
    appId: string;
  }

  export function register(appId: string): Promise<GCMCredentials>;
}

declare module 'push-receiver/src/fcm' {
  export interface FCMCredentials {
    keys: {
      privateKey: string;
      publicKey: string;
      authSecret: string;
    };

    fcm: {
      token: string;
      pushSet: string;
    };
  }

  export default function registerFCM(data: { token: string; senderId: string; appId: string }): Promise<any>;
}
