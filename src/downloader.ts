import { GaxiosError, GaxiosResponse, request } from 'gaxios';
import { error, log } from 'node:console';
import { setTimeout } from 'node:timers/promises';

type NpmResponse = {
  objects: {
    downloads: { monthly: number; weekly: number };
    package: { name: string; version: string };
  }[];
  total: number;
  time: string;
};

const getPackageVersion = async (pkgName: string): Promise<string> => {
  const response = await request<NpmResponse>({
    baseUrl: 'https://registry.npmjs.com',
    method: 'GET',
    url: `/-/v1/search?text=${encodeURIComponent(pkgName)}&size=1`
  });
  return response?.data?.objects?.[0]?.package?.version || '--';
};

const downloadPkg = async (pkgName: string, ver: string): Promise<unknown> => {
  try {
    return request<unknown>({
      baseUrl: 'https://registry.yarnpkg.com',
      method: 'GET',
      responseType: 'stream',
      timeout: 5000,
      url: `/${pkgName}/-/${pkgName}-${ver}.tgz`
    });
  } catch (err) {
    error('Error occurred when downloading "%s@%s"', pkgName, ver, err);
    return true;
  }
};

const action = async (nam: string, ver: string, max: number): Promise<void> => {
  const requests: Promise<unknown>[] = [];
  const times = max >= 250 ? 250 : max;
  for (let i = 0; i < times; i++) {
    requests.push(downloadPkg(nam, ver));
  }
  await Promise.all(requests);
  if (max > 250) {
    await setTimeout(1000);
    await action(nam, ver, max - 250);
  }
};

const runDownload = async (pkgName: string, times: number): Promise<void> => {
  const version = await getPackageVersion(pkgName);
  if (version !== '--') {
    log('Downloading "%s@%s" times "%s"', pkgName, version, times);
    await action(pkgName, version, times);
  }
};

export { action, downloadPkg, getPackageVersion, runDownload };
