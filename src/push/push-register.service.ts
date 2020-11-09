import got from 'got';

import { buildCheckinRequest, generateFid, parseCheckinResponse } from './push.utils';
import { CheckinResponse, FidInstallationResponse, FidTokenResponse, GcmRegisterResponse } from './fid.model';

export class PushRegisterService {
  private readonly APP_PACKAGE = 'com.oceanwing.battery.cam';
  private readonly APP_ID = '1:348804314802:android:440a6773b3620da7';
  private readonly APP_SENDER_ID = '348804314802';
  private readonly APP_CERT_SHA1 = 'F051262F9F99B638F3C76DE349830638555B4A0A';
  private readonly FCM_PROJECT_ID = 'batterycam-3250a';
  private readonly GOOGLE_API_KEY = 'AIzaSyCSz1uxGrHXsEktm7O3_wv-uLGpC9BvXR8';
  private readonly AUTH_VERSION = 'FIS_v2';

  public async registerFid(fid: string): Promise<FidInstallationResponse> {
    const url = `https://firebaseinstallations.googleapis.com/v1/projects/${this.FCM_PROJECT_ID}/installations`;

    const data = {
      fid: fid,
      appId: `${this.APP_ID}`,
      authVersion: `${this.AUTH_VERSION}`,
      sdkVersion: 'a:16.3.1',
    };

    const { body } = await got.post<FidInstallationResponse>(url, {
      body: JSON.stringify(data),
      headers: {
        'X-Android-Package': `${this.APP_PACKAGE}`,
        'X-Android-Cert': `${this.APP_CERT_SHA1}`,
        'x-goog-api-key': `${this.GOOGLE_API_KEY}`,
      },
      responseType: 'json',
    });

    return {
      ...body,
      authToken: {
        ...body.authToken,
        expiresAt: this.buildExpiresAt(body.authToken.expiresIn),
      },
    };
  }

  private buildExpiresAt(expiresIn: string): number {
    if (expiresIn.endsWith('ms')) {
      return new Date().getTime() + Number.parseInt(expiresIn.substring(0, expiresIn.length - 2));
    } else if (expiresIn.endsWith('s')) {
      return new Date().getTime() + Number.parseInt(expiresIn.substring(0, expiresIn.length - 1)) * 1000;
    }
    throw new Error(`Unknown expiresIn-format: ${expiresIn}`);
  }

  public async renewFidToken(fid: string, refreshToken: string): Promise<FidTokenResponse> {
    const url = `https://firebaseinstallations.googleapis.com/v1/projects/${this.FCM_PROJECT_ID}/installations/${fid}/authTokens:generate`;

    const { body } = await got.post<FidTokenResponse>(url, {
      headers: {
        'X-Android-Package': `${this.APP_PACKAGE}`,
        'X-Android-Cert': `${this.APP_CERT_SHA1}`,
        'x-goog-api-key': `${this.GOOGLE_API_KEY}`,
        Authorization: `${this.AUTH_VERSION} ${refreshToken}`,
      },
      responseType: 'json',
    });

    return {
      ...body,
      expiresAt: this.buildExpiresAt(body.expiresIn),
    };
  }

  public async createPushCredentials(): Promise<{
    fidResponse: FidInstallationResponse;
    checkinResponse: CheckinResponse;
    gcmResponse: GcmRegisterResponse;
  }> {
    const generatedFid = generateFid();

    const registerFidResponse = await this.registerFid(generatedFid);
    const checkinResponse = await this.executeCheckin();
    const registerGcmResponse = await this.registerGcm(registerFidResponse, checkinResponse);

    return {
      fidResponse: registerFidResponse,
      checkinResponse: checkinResponse,
      gcmResponse: registerGcmResponse,
    };
  }

  public async executeCheckin(): Promise<CheckinResponse> {
    const url = 'https://android.clients.google.com/checkin';
    const buffer = await buildCheckinRequest();

    const response = await got.post(url, {
      headers: {
        'Content-Type': 'application/x-protobuf',
      },
      body: Buffer.from(buffer),
    });
    return await parseCheckinResponse(response.rawBody);
  }

  public async registerGcm(
    fidInstallationResponse: FidInstallationResponse,
    checkinResponse: CheckinResponse,
  ): Promise<GcmRegisterResponse> {
    const url = 'https://android.clients.google.com/c2dm/register3';
    const androidId = checkinResponse.androidId;
    const fid = fidInstallationResponse.fid;
    const securityToken = checkinResponse.securityToken;

    const response = await got.post<string>(url, {
      headers: {
        Authorization: `AidLogin ${androidId}:${securityToken}`,
        app: `${this.APP_PACKAGE}`,
        gcm_ver: '201216023',
        'User-Agent': 'Android-GCM/1.5 (OnePlus5 NMF26X)',
      },
      form: {
        'X-subtype': `${this.APP_SENDER_ID}`,
        sender: `${this.APP_SENDER_ID}`,
        'X-app_ver': '741',
        'X-osv': '25',
        'X-cliv': 'fiid-20.2.0',
        'X-gmsv': '201216023',
        'X-appid': `${fid}`,
        'X-scope': '*',
        'X-Goog-Firebase-Installations-Auth': `${fidInstallationResponse.authToken.token}`,
        'X-gmp_app_id': `${this.APP_ID}`,
        'X-Firebase-Client':
          'fire-abt/17.1.1+fire-installations/16.3.1+fire-android/+fire-analytics/17.4.2+fire-iid/20.2.0+fire-rc/17.0.0+fire-fcm/20.2.0+fire-cls/17.0.0+fire-cls-ndk/17.0.0+fire-core/19.3.0',
        'X-firebase-app-name-hash': 'R1dAH9Ui7M-ynoznwBdw01tLxhI',
        'X-Firebase-Client-Log-Type': '1',
        'X-app_ver_name': 'v2.2.2_741',
        app: `${this.APP_PACKAGE}`,
        device: `${androidId}`,
        app_ver: '741',
        info: 'g3EMJXXElLwaQEb1aBJ6XhxiHjPTUxc',
        gcm_ver: '201216023',
        plat: '0',
        cert: `${this.APP_CERT_SHA1}`,
        target_ver: '28',
      },
    });

    const body = response.body;
    if (body.includes('Error=PHONE_REGISTRATION_ERROR')) {
      throw new Error(`GCM-Register -> Error=PHONE_REGISTRATION_ERROR`);
    }

    return {
      token: body.split('=')[1],
    };
  }
}
