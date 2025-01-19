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
      expect(runDownloadSpy).toHaveBeenCalledTimes(5);
      expect(runDownloadSpy).toHaveBeenNthCalledWith(
        1,
        'commitlint-config-smallela',
        5000
      );
      expect(runDownloadSpy).toHaveBeenNthCalledWith(
        2,
        'jest-preset-smallela',
        5000
      );
      expect(runDownloadSpy).toHaveBeenNthCalledWith(
        3,
        'prettier-config-smallela',
        5000
      );
      expect(runDownloadSpy).toHaveBeenNthCalledWith(4, 'print-cli', 5000);
      expect(runDownloadSpy).toHaveBeenNthCalledWith(
        5,
        'versions-checker',
        5000
      );
    });
  });
});
