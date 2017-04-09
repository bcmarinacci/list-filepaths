'use strict';

const path = require('path');
const mkdirp = require('mkdirp');
const listFilepaths = require('../index');

const mkdirpPromise = filepath => new Promise((resolve, reject) => {
  mkdirp(filepath, (err, made) => {
    if (err) {
      reject(err);
    } else {
      resolve(made);
    }
  });
});

describe('listFilepaths', () => {
  let targetPath;
  beforeEach(() => {
    targetPath = '__fixtures__/ships';
  });

  it('should return an array of absolute filepaths', async () => {
    const expectedFilepaths = [
      path.resolve('__fixtures__/ships/millennium-falcon/millennium-falcon.js'),
      path.resolve('__fixtures__/ships/millennium-falcon/pilots/chewbacca.js'),
      path.resolve('__fixtures__/ships/millennium-falcon/pilots/han-solo.js'),
      path.resolve('__fixtures__/ships/slave-i/pilots/boba-fett.js'),
      path.resolve('__fixtures__/ships/slave-i/slave-i.js')
    ];

    const filepaths = await listFilepaths(targetPath);
    expect(filepaths.length).toEqual(expectedFilepaths.length);
    expect(filepaths).toEqual(expectedFilepaths);
  });

  it('should optionally return an array of relative filepaths', async () => {
    const expectedFilepaths = [
      '__fixtures__/ships/millennium-falcon/millennium-falcon.js',
      '__fixtures__/ships/millennium-falcon/pilots/chewbacca.js',
      '__fixtures__/ships/millennium-falcon/pilots/han-solo.js',
      '__fixtures__/ships/slave-i/pilots/boba-fett.js',
      '__fixtures__/ships/slave-i/slave-i.js'
    ];

    const filepaths = await listFilepaths(targetPath, { relative: true });
    expect(filepaths.length).toEqual(expectedFilepaths.length);
    expect(filepaths).toEqual(expectedFilepaths);
  });

  it('should optionally filter filepaths using a regular expression', async () => {
    const expectedFilepaths = [
      path.resolve('__fixtures__/ships/millennium-falcon/millennium-falcon.js'),
      path.resolve('__fixtures__/ships/millennium-falcon/pilots/chewbacca.js'),
      path.resolve('__fixtures__/ships/millennium-falcon/pilots/han-solo.js')
    ];

    const filepaths = await listFilepaths(targetPath, { filter: /millennium-falcon/ });
    expect(filepaths.length).toEqual(expectedFilepaths.length);
    expect(filepaths).toEqual(expectedFilepaths);
  });

  it('should optionally filter filepaths using a function', async () => {
    const expectedFilepaths = [
      path.resolve('__fixtures__/ships/millennium-falcon/pilots/chewbacca.js'),
      path.resolve('__fixtures__/ships/millennium-falcon/pilots/han-solo.js'),
      path.resolve('__fixtures__/ships/slave-i/pilots/boba-fett.js')
    ];

    const options = {
      filter(filepath) {
        return /pilots/.test(filepath);
      }
    };

    const filepaths = await listFilepaths(targetPath, options);
    expect(filepaths.length).toEqual(expectedFilepaths.length);
    expect(filepaths).toEqual(expectedFilepaths);
  });

  it('should optionally reject filepaths using a regular expression', async () => {
    const expectedFilepaths = [
      path.resolve('__fixtures__/ships/slave-i/pilots/boba-fett.js'),
      path.resolve('__fixtures__/ships/slave-i/slave-i.js')
    ];

    const filepaths = await listFilepaths(targetPath, { reject: /millennium-falcon/ });
    expect(filepaths.length).toEqual(expectedFilepaths.length);
    expect(filepaths).toEqual(expectedFilepaths);
  });

  it('should optionally reject filepaths using a function', async () => {
    const expectedFilepaths = [
      path.resolve('__fixtures__/ships/millennium-falcon/millennium-falcon.js'),
      path.resolve('__fixtures__/ships/slave-i/slave-i.js')
    ];

    const options = {
      reject(filepath) {
        return /pilots/.test(filepath);
      }
    };

    const filepaths = await listFilepaths(targetPath, options);
    expect(filepaths.length).toEqual(expectedFilepaths.length);
    expect(filepaths).toEqual(expectedFilepaths);
  });

  it('should optionally stop at a specified depth', async () => {
    const expectedFilepathsForDepth1 = [
      path.resolve('__fixtures__/ships/millennium-falcon/millennium-falcon.js'),
      path.resolve('__fixtures__/ships/slave-i/slave-i.js')
    ];

    const expectedFilepathsForDepth2 = [
      path.resolve('__fixtures__/ships/millennium-falcon/millennium-falcon.js'),
      path.resolve('__fixtures__/ships/millennium-falcon/pilots/chewbacca.js'),
      path.resolve('__fixtures__/ships/millennium-falcon/pilots/han-solo.js'),
      path.resolve('__fixtures__/ships/slave-i/pilots/boba-fett.js'),
      path.resolve('__fixtures__/ships/slave-i/slave-i.js')
    ];

    const [filepathsDepth0, filepathsDepth1, filepathsDepth2] = await Promise.all([
      listFilepaths(targetPath, { depth: 0 }),
      listFilepaths(targetPath, { depth: 1 }),
      listFilepaths(targetPath, { depth: 2 })
    ]);

    expect(filepathsDepth0).toEqual(null);
    expect(filepathsDepth1.length).toEqual(expectedFilepathsForDepth1.length);
    expect(filepathsDepth1).toEqual(expectedFilepathsForDepth1);
    expect(filepathsDepth2.length).toEqual(expectedFilepathsForDepth2.length);
    expect(filepathsDepth2).toEqual(expectedFilepathsForDepth2);
  });

  it('should return null if a negative depth is provided', async () => {
    const filepaths = await listFilepaths(targetPath, { depth: -1 });
    expect(filepaths).toEqual(null);
  });

  it('should return null for empty directories', async () => {
    const emptyDirPath = '__fixtures__/ships/t-47';
    // Create an empty directory to test against
    await mkdirpPromise(emptyDirPath);
    const filepaths = await listFilepaths(emptyDirPath);
    expect(filepaths).toEqual(null);
  });

  it('should return null if no filepaths match options.filter', async () => {
    const filepaths = await listFilepaths(targetPath, { filter: /finn/ });
    expect(filepaths).toEqual(null);
  });

  it('should should throw an error if a file path is passed in as an argument', async () => {
    try {
      await listFilepaths('__fixtures__/ships/slave-i/slave-i.js');
    } catch (err) {
      expect(err.message).toMatch(/ENOTDIR: not a director/);
    }
  });

  it('should throw an error for an invalid path', async () => {
    try {
      await listFilepaths('invalid/filepath');
    } catch (err) {
      expect(err.message).toMatch(/ENOENT: no such file or directory/);
    }
  });
});
