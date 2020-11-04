export interface FidInstallationResponse {
  name: string;
  fid: string;
  refreshToken: string;
  authToken: {
    token: string;
    expiresIn: string;
  };
}

export interface CheckinResponse {
  statsOk: boolean;
  timeMs: string;
  androidId: string;
  securityToken: string;
  versionInfo: string;
  deviceDataVersionInfo: string;
}

export interface GcmRegisterResponse {
  token: string;
}

export interface Message {
  tag: number;
  object: any;
}
