import { setTimeout } from 'node:timers/promises';
import { runDownload } from './downloader';

export const main = async () => {
  [
    'commitlint-config-smallela',
    'jest-preset-smallela',
    'prettier-config-smallela',
    'print-cli',
    'versions-checker'
  ].forEach(async pkg => {
    await runDownload(pkg, 5000);
    await setTimeout(15000);
  });
};

main();
