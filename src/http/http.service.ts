import { postRequest } from './http.utils';
import { LoginResult, Hub, DeviceRequest, FullDevice, DskKey, Stream } from './http-response.models';
import { HistoryRecordRequest, StreamRequest } from './http-request.models';

export class HttpService {
  private baseUrl = 'https://mysecurity.eufylife.com/api/v1';
  private currentLoginResult: LoginResult | null = null;

  constructor(private username: string, private password: string) {}

  public async listHubs(): Promise<Array<Hub>> {
    return await this.requestWithToken(`/app/get_hub_list`);
  }

  public async listDevices(deviceRequest?: Partial<DeviceRequest>): Promise<Array<FullDevice>> {
    const reqBody = {
      device_sn: '',
      num: 100,
      orderby: '',
      page: 0,
      station_sn: '',
      ...deviceRequest,
    };

    return await this.requestWithToken<Array<FullDevice>>(`/app/get_devs_list`, reqBody);
  }

  public async stationDskKeys(station_sns: string): Promise<DskKey> {
    const reqBody = { station_sns: [station_sns] };
    return await this.requestWithToken<DskKey>(`/app/equipment/get_dsk_keys`, reqBody);
  }

  public async allHistoryRecord(historyRecord?: HistoryRecordRequest): Promise<any> {
    const reqBody = {
      device_sn: '',
      end_time: 0,
      id: 0,
      num: 100,
      offset: -14400,
      pullup: true,
      shared: true,
      start_time: 0,
      storage: 0,
      ...historyRecord,
    };
    return await this.requestWithToken(`/event/app/get_all_history_record`, reqBody);
  }

  public async startStream(startStreamRequest: StreamRequest): Promise<Stream> {
    const reqBody = {
      proto: 2,
      ...startStreamRequest,
    };
    return await this.requestWithToken(`/web/equipment/start_stream`, reqBody);
  }

  public async stopStream(stopStreamRequest: StreamRequest): Promise<void> {
    const reqBody = {
      proto: 2,
      ...stopStreamRequest,
    };
    return await this.requestWithToken(`/web/equipment/stop_stream`, reqBody);
  }

  private async requestWithToken<T>(path: string, body?: any): Promise<T> {
    const token = await this.getToken();
    return await postRequest(`${this.baseUrl}${path}`, body, token);
  }

  private async getToken(): Promise<string> {
    if (!this.currentLoginResult || this.isTokenOutdated()) {
      this.currentLoginResult = await this.login(this.username, this.password);
    }

    return this.currentLoginResult.auth_token;
  }

  private isTokenOutdated(): boolean {
    if (!this.currentLoginResult) {
      return true;
    }
    const now = Math.floor(+new Date() / 1000);
    return this.currentLoginResult.token_expires_at >= now;
  }

  private async login(email: string, password: string): Promise<LoginResult> {
    const result = await postRequest<LoginResult>(`${this.baseUrl}/passport/login`, { email, password });
    if (!!result.domain) {
      this.baseUrl = `https://${result.domain}/v1`;
      return this.login(email, password);
    }

    return result;
  }
}
