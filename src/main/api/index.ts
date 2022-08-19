import { net } from 'electron';
import ElectronStore from 'electron-store';

const store = new ElectronStore();
export const getToken = (): Promise<{ data: string }> => {
  return new Promise((resolve) => {
    const request = net.request('https://v2.jinrishici.com/token');
    request.on('response', (response) => {
      response.on('data', (chunk) => {
        const { data } = JSON.parse(chunk.toString());
        store.set('userToken', data);
        resolve({ data });
      });
    });
    request.end();
  });
};

export const getPoetry = async (): Promise<{ data: any }> => {
  let token = store.get('userToken');
  if (!token) {
    const { data } = await getToken();
    token = data;
  }
  return new Promise((resolve, reject) => {
    const request = net.request('https://v2.jinrishici.com/sentence');
    request.setHeader('X-User-Token', `${token}`);
    request.on('response', (response) => {
      response.on('data', (chunk) => {
        resolve(JSON.parse(chunk.toString()));
      });
    });
    request.on('error', reject);
    request.end();
  });
};
