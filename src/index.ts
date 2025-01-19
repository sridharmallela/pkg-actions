import { setTimeout } from 'node:timers/promises';
import { runDownload } from './downloader';

export const main = async () => {
  [
    'commitlint-config-smallela',
    'eslint-config-smallela',
    'jest-preset-smallela',
    'npm-commands-smallela',
    'nx-commands-smallela',
    'prettier-config-smallela',
    'print-cli',
    'stylelint-config-smallela',
    'versions-checker'
  ].forEach(async pkg => {
    await runDownload(pkg, 5000);
    await setTimeout(15000);
  });
};

main();
