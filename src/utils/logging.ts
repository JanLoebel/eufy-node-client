import * as dotenv from 'dotenv';

dotenv.config();
const DEBUG = (process.env.DEBUG as string)?.toLowerCase() === 'true';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const LOG = (...msg: any): void => {
  if (!!DEBUG) {
    console.log(...msg);
  }
};
