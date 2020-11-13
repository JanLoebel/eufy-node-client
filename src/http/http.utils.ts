import got from 'got';
import { LOG } from '../utils/logging';

export const postRequest = async <T>(
  url: string,
  requestBody?: Record<string, unknown> | undefined,
  token?: string,
  headers: Record<string, unknown> = {},
): Promise<T> => {
  const jsonBody = !!requestBody ? { json: { ...requestBody } } : {};
  const resultHeaders = !!token ? { headers: { ...headers, 'x-auth-token': token } } : { ...headers };
  const { body } = await got.post<T>(url, {
    ...jsonBody,
    ...resultHeaders,
    responseType: 'json',
  });

  const anyBody = body as any;
  if (anyBody.code !== 0) {
    throw new Error(`Request failed: ${url} -> ${anyBody.code} - ${anyBody.msg}`);
  }

  LOG(`url: ${url} -> body: ${JSON.stringify(body)}`);

  if (!!anyBody.data) {
    return anyBody.data;
  }

  return body;
};

export const promiseAny = <T>(iterable: Array<Promise<any>>): Promise<T> => {
  return reverse(Promise.all([...iterable].map(reverse)));
};

const reverse = <T>(promise: Promise<any>): Promise<T> => {
  return new Promise((resolve, reject) => Promise.resolve(promise).then(reject, resolve));
};
