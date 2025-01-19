jest.mock('node:console', () => ({
  ...jest.requireActual('node:console'),
  error: jest.fn().mockImplementation(),
  log: jest.fn().mockImplementation()
}));
jest.mock('gaxios');

import * as gaxios from 'gaxios';

import {
  action,
  downloadPkg,
  getPackageVersion,
  runDownload
} from './downloader';

describe('downloader ---', () => {
  let requestSpy: jest.SpyInstance;

  beforeEach(() => {
    requestSpy = jest.spyOn(gaxios, 'request');
    expect(requestSpy).toBeDefined();
    expect(requestSpy).not.toHaveBeenCalled();
  });

  afterEach(() => {
    requestSpy.mockRestore();
  });

  describe('should test getPackageVersion ---', () => {
    test('when response valid', async () => {
      requestSpy.mockResolvedValue({
        data: { objects: [{ package: { version: '1.2.3' } }] }
      });
      expect(await getPackageVersion('TEST')).toEqual('1.2.3');
      expect(requestSpy).toHaveBeenCalled();
      expect(requestSpy).toHaveBeenCalledTimes(1);
      expect(requestSpy).toHaveBeenCalledWith({
        baseUrl: 'https://registry.npmjs.com',
        method: 'GET',
        url: '/-/v1/search?text=TEST&size=1'
      });
    });

    test.each([
      undefined,
      null,
      '',
      {},
      { data: '' },
      { data: {} },
      { data: { objects: '' } },
      { data: { objects: [] } },
      { data: { objects: [{}] } },
      { data: { objects: [{ package: '' }] } },
      { data: { objects: [{ package: {} }] } },
      { data: { objects: [{ package: { version: '' } }] } }
    ])('when response "%s"', async data => {
      requestSpy.mockResolvedValue(data);
      expect(await getPackageVersion('TEST')).toEqual('--');
      expect(requestSpy).toHaveBeenCalled();
      expect(requestSpy).toHaveBeenCalledTimes(1);
      expect(requestSpy).toHaveBeenCalledWith({
        baseUrl: 'https://registry.npmjs.com',
        method: 'GET',
        url: '/-/v1/search?text=TEST&size=1'
      });
    });
  });

  describe('should test downloadPkg ---', () => {
    test('when valid', async () => {
      requestSpy.mockResolvedValue('TEST_RESP');
      expect(await downloadPkg('TEST', '1.2.3')).toEqual('TEST_RESP');
      expect(requestSpy).toHaveBeenCalled();
      expect(requestSpy).toHaveBeenCalledTimes(1);
      expect(requestSpy).toHaveBeenCalledWith({
        baseUrl: 'https://registry.yarnpkg.com',
        method: 'GET',
        responseType: 'stream',
        timeout: 5000,
        url: '/TEST/-/TEST-1.2.3.tgz'
      });
    });

    test('when error', async () => {
      requestSpy.mockImplementation(() => {
        throw new Error();
      });
      expect(await downloadPkg('TEST', '1.2.3')).toEqual(true);
      expect(requestSpy).toHaveBeenCalled();
      expect(requestSpy).toHaveBeenCalledTimes(1);
      expect(requestSpy).toHaveBeenCalledWith({
        baseUrl: 'https://registry.yarnpkg.com',
        method: 'GET',
        responseType: 'stream',
        timeout: 5000,
        url: '/TEST/-/TEST-1.2.3.tgz'
      });
    });
  });

  describe('should test action ---', () => {
    test('when valid', async () => {
      requestSpy.mockResolvedValue('TEST_RESP');
      await action('TEST', '1.2.3', 251);
      expect(requestSpy).toHaveBeenCalled();
      expect(requestSpy).toHaveBeenCalledTimes(251);
      expect(requestSpy).toHaveBeenCalledWith({
        baseUrl: 'https://registry.yarnpkg.com',
        method: 'GET',
        responseType: 'stream',
        timeout: 5000,
        url: '/TEST/-/TEST-1.2.3.tgz'
      });
    });
  });

  describe('should test runDownload ---', () => {
    test('when valid', async () => {
      requestSpy.mockResolvedValue({
        data: { objects: [{ package: { version: '1.2.3' } }] }
      });
      await runDownload('TEST', 1);
      expect(requestSpy).toHaveBeenCalled();
      expect(requestSpy).toHaveBeenCalledTimes(2);
      expect(requestSpy).toHaveBeenNthCalledWith(1, {
        baseUrl: 'https://registry.npmjs.com',
        method: 'GET',
        url: '/-/v1/search?text=TEST&size=1'
      });
      expect(requestSpy).toHaveBeenNthCalledWith(2, {
        baseUrl: 'https://registry.yarnpkg.com',
        method: 'GET',
        responseType: 'stream',
        timeout: 5000,
        url: '/TEST/-/TEST-1.2.3.tgz'
      });
    });

    test('when invalid version', async () => {
      requestSpy.mockResolvedValue({});
      await runDownload('TEST', 1);
      expect(requestSpy).toHaveBeenCalled();
      expect(requestSpy).toHaveBeenCalledTimes(1);
      expect(requestSpy).toHaveBeenCalledWith({
        baseUrl: 'https://registry.npmjs.com',
        method: 'GET',
        url: '/-/v1/search?text=TEST&size=1'
      });
    });
  });
});
