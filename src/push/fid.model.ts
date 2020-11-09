export interface FidTokenResponse {
  token: string;
  expiresIn: string;
  expiresAt: number;
}

export interface FidInstallationResponse {
  name: string;
  fid: string;
  refreshToken: string;
  authToken: FidTokenResponse;
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

export enum ProcessingState {
  MCS_VERSION_TAG_AND_SIZE = 0,
  MCS_TAG_AND_SIZE = 1,
  MCS_SIZE = 2,
  MCS_PROTO_BYTES = 3,
}

export enum MessageTag {
  HeartbeatPing = 0,
  HeartbeatAck = 1,
  LoginRequest = 2,
  LoginResponse = 3,
  Close = 4,
  MessageStanza = 5,
  PresenceStanza = 6,
  IqStanza = 7,
  DataMessageStanza = 8,
  BatchPresenceStanza = 9,
  StreamErrorStanza = 10,
  HttpRequest = 11,
  HttpResponse = 12,
  BindAccountRequest = 13,
  BindAccountResponse = 14,
  TalkMetadata = 15,
  NumProtoTypes = 16,
}
