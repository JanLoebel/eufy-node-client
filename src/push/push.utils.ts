export const VALID_FID_PATTERN = /^[cdef][\w-]{21}$/;
export const INVALID_FID = 'INVALID';

import { randomBytes } from 'crypto';
import { load } from 'protobuf-typescript';
import { CheckinResponse } from './fid.model';

export function generateFid(): string {
  try {
    const fidByteArray = new Uint8Array(17);
    fidByteArray.set(randomBytes(fidByteArray.length));

    // Replace the first 4 random bits with the constant FID header of 0b0111.
    fidByteArray[0] = 0b01110000 + (fidByteArray[0] % 0b00010000);

    const b64 = Buffer.from(fidByteArray).toString('base64');
    const b64_safe = b64.replace(/\+/g, '-').replace(/\//g, '_');
    const fid = b64_safe.substr(0, 22);
    return VALID_FID_PATTERN.test(fid) ? fid : INVALID_FID;
  } catch {
    // FID generation errored
    return INVALID_FID;
  }
}

export const buildCheckinRequest = async (): Promise<Uint8Array> => {
  const root = await load('checkin.proto');
  const CheckinRequestModel = root.lookupType('CheckinRequest');

  const payload = {
    imei: '109269993813709',
    androidId: 0,
    checkin: {
      build: {
        fingerprint: 'google/razor/flo:5.0.1/LRX22C/1602158:user/release-keys',
        hardware: 'flo',
        brand: 'google',
        radio: 'FLO-04.04',
        clientId: 'android-google',
      },
      lastCheckinMs: 0,
    },
    locale: 'en',
    loggingId: 1234567890,
    macAddress: ['A1B2C3D4E5F6'],
    meid: '109269993813709',
    accountCookie: [],
    timeZone: 'GMT',
    version: 3,
    otaCert: ['71Q6Rn2DDZl1zPDVaaeEHItd+Yg='],
    esn: 'ABCDEF01',
    macAddressType: ['wifi'],
    fragment: 0,
    userSerialNumber: 0,
  };

  const message = CheckinRequestModel.create(payload);
  return CheckinRequestModel.encode(message).finish();
};

export const parseCheckinResponse = async (data: Buffer): Promise<CheckinResponse> => {
  const root = await load('checkin.proto');
  const CheckinResponseModel = root.lookupType('CheckinResponse');
  const message = CheckinResponseModel.decode(data);
  const object = CheckinResponseModel.toObject(message, {
    longs: String,
    enums: String,
    bytes: String,
  });
  return object as CheckinResponse;
};

export const sleep = async (ms: number): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};
