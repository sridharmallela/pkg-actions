import { setTimeout } from 'node:timers/promises';
import { runDownload } from './downloader';

export const main = async () => {
  [
    { name: 'commitlint-config-ngs', ver: '1.0.2' },
    { name: 'eslint-config-ngs', ver: '1.0.1' },
    { name: 'jest-preset-ngs', ver: '1.0.5' },
    { name: 'npm-commands-ngs', ver: '1.0.1' },
    { name: 'nx-commands-ngs', ver: '1.0.1' },
    { name: 'prettier-config-ngs', ver: '1.0.3' },
    { name: 'print-cli', ver: '2.1.12' },
    { name: 'stylelint-config-ngs', ver: '1.0.1' },
    { name: 'versions-checker', ver: '2.1.12' }
  ].forEach(async pkg => {
    await runDownload(pkg.name, pkg.ver, 100000);
    await setTimeout(5000);
  });
};

main();
