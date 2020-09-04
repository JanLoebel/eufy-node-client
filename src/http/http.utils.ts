import got from 'got';

export const postRequest = async <T>(
  url: string,
  requestBody?: Record<string, unknown>,
  token?: string,
): Promise<T> => {
  const jsonBody = !!requestBody ? { json: { ...requestBody } } : {};
  const headers = !!token ? { headers: { 'x-auth-token': token } } : {};

  // console.log(`POST ${url}`, jsonBody, headers);
  const { body } = await got.post<T>(url, {
    ...jsonBody,
    ...headers,
    responseType: 'json',
  });

  const anyBody = body as any;
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
