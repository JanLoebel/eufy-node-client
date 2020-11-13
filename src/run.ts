import * as dotenv from 'dotenv';
import * as fs from 'fs';

import { HttpService } from './http';
import { CloudLookupService } from './p2p/cloud-lookup.service';
import { LocalLookupService, DeviceClientService, CommandType } from './p2p';
import { PushRegisterService, PushClient, sleep } from './push';

// Read from env
dotenv.config();
const USERNAME = process.env.USERNAME as string;
const PASSWORD = process.env.PASSWORD as string;
const DSK_KEY = process.env.DSK_KEY as string;
const P2P_DID = process.env.P2P_DID as string;
const ACTOR_ID = process.env.ACTOR_ID as string;

const mainP2pCloud = async () => {
  const lookupService = new CloudLookupService();
  try {
    const addresses = await lookupService.lookup(P2P_DID, DSK_KEY);
    console.log('Found addresses', addresses);
  } catch (err) {
    console.error('Not found any address...', err);
  }
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

// mainP2pLocal();
// mainP2pCloud();
// mainPush();
// mainReadMultiPackages();
// mainStartVideoDownload();
