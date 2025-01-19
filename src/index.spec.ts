import * as down from './downloader';

import { main } from './index';

describe('index ---', () => {
  let runDownloadSpy: jest.SpyInstance;

  beforeEach(() => {
    runDownloadSpy = jest.spyOn(down, 'runDownload');
    expect(runDownloadSpy).toBeDefined();
    runDownloadSpy.mockImplementation();
    expect(runDownloadSpy).not.toHaveBeenCalled();
  });

  afterEach(() => {
    runDownloadSpy.mockRestore();
  });

  describe('should test main ---', () => {
    test('', async () => {
      expect(main).toBeDefined();
      await main();
      expect(runDownloadSpy).toHaveBeenCalled();
      expect(runDownloadSpy).toHaveBeenCalledTimes(9);
      expect(runDownloadSpy).toHaveBeenNthCalledWith(
        1,
        'commitlint-config-smallela',
        5000
      );
      expect(runDownloadSpy).toHaveBeenNthCalledWith(
        2,
        'eslint-config-smallela',
        5000
      );
      expect(runDownloadSpy).toHaveBeenNthCalledWith(
        3,
        'jest-preset-smallela',
        5000
      );
      expect(runDownloadSpy).toHaveBeenNthCalledWith(
        4,
        'npm-commands-smallela',
        5000
      );
      expect(runDownloadSpy).toHaveBeenNthCalledWith(
        5,
        'nx-commands-smallela',
        5000
      );
      expect(runDownloadSpy).toHaveBeenNthCalledWith(
        6,
        'prettier-config-smallela',
        5000
      );
      expect(runDownloadSpy).toHaveBeenNthCalledWith(7, 'print-cli', 5000);
      expect(runDownloadSpy).toHaveBeenNthCalledWith(
        8,
        'stylelint-config-smallela',
        5000
      );
      expect(runDownloadSpy).toHaveBeenNthCalledWith(
        9,
        'versions-checker',
        5000
      );
    });
  });
});
