import { request } from 'gaxios';
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

const downloadPkg = async (
  pkgName: string,
  ver: string,
  stats: any
): Promise<boolean> => {
  try {
    const resp = await request<unknown>({
      baseUrl: 'https://registry.yarnpkg.com',
      method: 'GET',
      responseType: 'stream',
      timeout: 30000,
      url: `/${pkgName}/-/${pkgName}-${ver}.tgz`
    });
    stats.success++;
    return true;
  } catch (err: any) {
    // error('Error occurred for "%s@%s"', pkgName, ver, err?.message);
    stats.failures++;
    return true;
  }
};

const action = async (
  nam: string,
  ver: string,
  max: number,
  stats: any
): Promise<void> => {
  const requests: Promise<unknown>[] = [];
  const times = max >= 250 ? 250 : max;
  for (let i = 0; i < times; i++) {
    requests.push(downloadPkg(nam, ver, stats));
  }
  await Promise.all(requests);
  if (max > 250) {
    await setTimeout(5000);
    await action(nam, ver, max - 250, stats);
  }
};

const runDownload = async (
  nam: string,
  ver: string,
  times: number
): Promise<void> => {
  const stats = { success: 0, failures: 0 };
  // const version = await getPackageVersion(nam);
  // if (version !== '--') {
  log('Downloading "%s@%s" times "%s"', nam, ver, times);
  await action(nam, ver, times, stats);
  log(
    'Downloading "%s@%s" success:"%s", failures: "%s"',
    nam,
    ver,
    stats.success,
    stats.failures
  );
  // }
};

export { action, downloadPkg, getPackageVersion, runDownload };
