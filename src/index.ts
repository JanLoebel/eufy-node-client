import * as dotenv from 'dotenv';
import * as fs from 'fs';

import { HttpService } from './http/http.service';
import { CloudLookupService } from './p2p/cloud-lookup.service';
import { LocalLookupService } from './p2p/local-lookup.service';
import { DeviceClientService } from './p2p/device-client.service';
import { PushRegisterService } from './push/push-register.service';
import { CommandType } from './p2p/command.model';
import { PushClient } from './push/push-client.service';
import { sleep } from './push/push.utils';

// Read from env
dotenv.config();
const USERNAME = process.env.USERNAME as string;
const PASSWORD = process.env.PASSWORD as string;
const DSK_KEY = process.env.DSK_KEY as string;
const P2P_DID = process.env.P2P_DID as string;
const ACTOR_ID = process.env.ACTOR_ID as string;
const STATION_SN = process.env.STATION_SN as string;

const mainHttp = async () => {
  const httpService = new HttpService(USERNAME, PASSWORD);

  const hubs = await httpService.listHubs();
  console.log('P2P_DID', hubs[0].p2p_did);
  console.log('ACTOR_ID', hubs[0].member.action_user_id);
  console.log('STATION_SN', hubs[0].station_sn);

  /*
  const devices = await httpService.listDevices();
  console.log(devices);
  */

  const dsk = await httpService.stationDskKeys(STATION_SN);
  console.log('DSK_KEY', dsk.dsk_keys[0]?.dsk_key);

  /*
  const history = await httpService.allHistoryRecord();
  console.log(history);
  */
};

const mainP2pCloud = async () => {
  const lookupService = new CloudLookupService();
  try {
    const addresses = await lookupService.lookup(P2P_DID, DSK_KEY);
    console.log('Found addresses', addresses);
  } catch (err) {
    console.error('Not found any address...', err);
  }
};

const mainP2pLocal = async () => {
  const lookupService = new LocalLookupService();
  const address = await lookupService.lookup('192.168.68.101');
  console.log('Found address', address);

  const devClientService = new DeviceClientService(address, P2P_DID, ACTOR_ID);
  await devClientService.connect();

  // CMD_SET_ARMING  # 0 => away 1 => home, 2 => schedule, 63 => disarmed
  devClientService.sendCommandWithInt(CommandType.CMD_SET_ARMING, 1);

  // CMD_SET_DEVS_OSD # 1 => disabled # 2 => enable
  devClientService.sendCommandWithIntString(CommandType.CMD_SET_DEVS_OSD, 1, 0);
};

const mainPush = async () => {
  console.log('Starting...');

  let credentials = null;
  // Check if credentials are existing
  if (fs.existsSync('credentials.json')) {
    console.log('Credentials found -> reusing them...');
    credentials = JSON.parse(fs.readFileSync('credentials.json').toString());
  } else {
    // Register push credentials
    console.log('No credentials found -> register new...');
    const pushService = new PushRegisterService();
    credentials = await pushService.createPushCredentials();
    // Store credentials
    fs.writeFileSync('credentials.json', JSON.stringify(credentials));

    // We have to wait shortly to give google some time to process the registration
    console.log('Wait a short time (5sec)...');
    await sleep(5 * 1000);
  }

  // Start push client
  const pushClient = await PushClient.init({
    androidId: credentials.checkinResponse.androidId,
    securityToken: credentials.checkinResponse.securityToken,
  });
  pushClient.connect((msg: any) => {
    console.log('Got push message:', msg);
  });

  // Register at eufy
  const fcmToken = credentials.gcmResponse.token;
  const httpService = new HttpService(USERNAME, PASSWORD);
  await httpService.registerPushToken(fcmToken);
  console.log('Registered at eufy with:', fcmToken);

  setInterval(async () => {
    await httpService.pushTokenCheck();
  }, 30 * 1000);
};

const mainReadMultiPackages = async () => {
  const lookupService = new LocalLookupService();
  const address = await lookupService.lookup('192.168.68.101');
  console.log('Found address', address);

  const devClientService = new DeviceClientService(address, P2P_DID, ACTOR_ID);
  await devClientService.connect();

  devClientService.sendCommandWithInt(CommandType.CMD_CAMERA_INFO, 255);
};

const mainStartVideoDownload = async () => {
  // TODO NOT YET WORKING!
  const lookupService = new LocalLookupService();
  const address = await lookupService.lookup('192.168.68.101');
  console.log('Found address', address);

  const devClientService = new DeviceClientService(address, P2P_DID, ACTOR_ID);
  await devClientService.connect();

  const fileName = '/media/mmcblk0p1/Camera00/h265_20201005114502.dat';
  devClientService.sendCommandWithString(CommandType.CMD_DOWNLOAD_VIDEO, fileName);
};

// mainHttp();
// mainP2pLocal();
// mainP2pCloud();
mainPush();
// mainReadMultiPackages();
// mainStartVideoDownload();
