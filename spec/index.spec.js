/* eslint-disable prefer-arrow-callback */
'use strict';

const { resolve } = require('path');
const mkdirp = require('mkdirp');
const listFilepaths = require('../');

const mkdirpAsync = function (path) {
  return new Promise((res, rej) => {
    mkdirp(path, (err, made) => {
      /* istanbul ignore if */
      if (err) {
        rej(err);
      } else {
        res(made);
      }
    });
  });
};

describe('listFilepaths', function () {
  beforeEach(function () {
    this.targetPath = 'spec/fixtures/ships';
  });

  it('should return an array of absolute filepaths', function (done) {
    const expectedFilepaths = [
      resolve('spec/fixtures/ships/millennium-falcon/millennium-falcon.js'),
      resolve('spec/fixtures/ships/millennium-falcon/pilots/chewbacca.js'),
      resolve('spec/fixtures/ships/millennium-falcon/pilots/han-solo.js'),
      resolve('spec/fixtures/ships/slave-i/pilots/boba-fett.js'),
      resolve('spec/fixtures/ships/slave-i/slave-i.js')
    ];

    listFilepaths(this.targetPath)
      .then(filepaths => {
        expect(filepaths.length).toEqual(expectedFilepaths.length);
        expect(filepaths).toEqual(expectedFilepaths);
        done();
      })
      .catch(done.fail);
  });

  it('should handle a filepath argument', function (done) {
    const expectedFilepaths = [resolve('spec/fixtures/ships/slave-i/slave-i.js')];

    listFilepaths('spec/fixtures/ships/slave-i/slave-i.js')
      .then(filepaths => {
        expect(filepaths.length).toEqual(expectedFilepaths.length);
        expect(filepaths).toEqual(expectedFilepaths);
        done();
      })
      .catch(done.fail);
  });

  it('should optionally return an array of relative filepaths', function (done) {
    const expectedFilepaths = [
      'spec/fixtures/ships/millennium-falcon/millennium-falcon.js',
      'spec/fixtures/ships/millennium-falcon/pilots/chewbacca.js',
      'spec/fixtures/ships/millennium-falcon/pilots/han-solo.js',
      'spec/fixtures/ships/slave-i/pilots/boba-fett.js',
      'spec/fixtures/ships/slave-i/slave-i.js'
    ];

    listFilepaths(this.targetPath, { relative: true })
      .then(filepaths => {
        expect(filepaths.length).toEqual(expectedFilepaths.length);
        expect(filepaths).toEqual(expectedFilepaths);
        done();
      })
      .catch(done.fail);
  });

  it('should optionally filter filepaths using a regular expression', function (done) {
    const expectedFilepaths = [
      resolve('spec/fixtures/ships/millennium-falcon/millennium-falcon.js'),
      resolve('spec/fixtures/ships/millennium-falcon/pilots/chewbacca.js'),
      resolve('spec/fixtures/ships/millennium-falcon/pilots/han-solo.js'),
    ];

    listFilepaths(this.targetPath, { filter: /millennium-falcon/ })
      .then(filepaths => {
        expect(filepaths.length).toEqual(expectedFilepaths.length);
        expect(filepaths).toEqual(expectedFilepaths);
        done();
      })
      .catch(done.fail);
  });

  it('should optionally filter filepaths using a function', function (done) {
    const expectedFilepaths = [
      resolve('spec/fixtures/ships/millennium-falcon/pilots/chewbacca.js'),
      resolve('spec/fixtures/ships/millennium-falcon/pilots/han-solo.js'),
      resolve('spec/fixtures/ships/slave-i/pilots/boba-fett.js'),
    ];

    const options = {
      filter(filepath) {
        return /pilots/.test(filepath);
      }
    };

    listFilepaths(this.targetPath, options)
      .then(filepaths => {
        expect(filepaths.length).toEqual(expectedFilepaths.length);
        expect(filepaths).toEqual(expectedFilepaths);
        done();
      })
      .catch(done.fail);
  });

  it('should optionally reject filepaths using a regular expression', function (done) {
    const expectedFilepaths = [
      resolve('spec/fixtures/ships/slave-i/pilots/boba-fett.js'),
      resolve('spec/fixtures/ships/slave-i/slave-i.js')
    ];

    listFilepaths(this.targetPath, { reject: /millennium-falcon/ })
      .then(filepaths => {
        expect(filepaths.length).toEqual(expectedFilepaths.length);
        expect(filepaths).toEqual(expectedFilepaths);
        done();
      })
      .catch(done.fail);
  });

  it('should optionally reject filepaths using a function', function (done) {
    const expectedFilepaths = [
      resolve('spec/fixtures/ships/millennium-falcon/millennium-falcon.js'),
      resolve('spec/fixtures/ships/slave-i/slave-i.js')
    ];

    const options = {
      reject(filepath) {
        return /pilots/.test(filepath);
      }
    };

    listFilepaths(this.targetPath, options)
      .then(filepaths => {
        expect(filepaths.length).toEqual(expectedFilepaths.length);
        expect(filepaths).toEqual(expectedFilepaths);
        done();
      })
      .catch(done.fail);
  });

  it('should optionally stop at a specified depth', function (done) {
    const expectedFilepathsForDepth1 = [
      resolve('spec/fixtures/ships/millennium-falcon/millennium-falcon.js'),
      resolve('spec/fixtures/ships/slave-i/slave-i.js')
    ];

    const expectedFilepathsForDepth2 = [
      resolve('spec/fixtures/ships/millennium-falcon/millennium-falcon.js'),
      resolve('spec/fixtures/ships/millennium-falcon/pilots/chewbacca.js'),
      resolve('spec/fixtures/ships/millennium-falcon/pilots/han-solo.js'),
      resolve('spec/fixtures/ships/slave-i/pilots/boba-fett.js'),
      resolve('spec/fixtures/ships/slave-i/slave-i.js')
    ];

    listFilepaths(this.targetPath, { depth: 0 })
      .then(filepaths => {
        expect(filepaths).toEqual(null);
        done();
      })
      .catch(done.fail);

    listFilepaths(this.targetPath, { depth: 1 })
      .then(filepaths => {
        expect(filepaths.length).toEqual(expectedFilepathsForDepth1.length);
        expect(filepaths).toEqual(expectedFilepathsForDepth1);
        done();
      })
      .catch(done.fail);

    listFilepaths(this.targetPath, { depth: 2 })
      .then(filepaths => {
        expect(filepaths.length).toEqual(expectedFilepathsForDepth2.length);
        expect(filepaths).toEqual(expectedFilepathsForDepth2);
        done();
      })
      .catch(done.fail);
  });

  it('should return null if a negative depth is provided', function (done) {
    listFilepaths(this.targetPath, { depth: -1 })
      .then(filepaths => {
        expect(filepaths).toEqual(null);
        done();
      })
      .catch(done.fail);
  });

  it('should return null for empty directories', function (done) {
    const emptyDirPath = 'spec/fixtures/ships/t-47';
    // Create an empty directory to test against
    mkdirpAsync(emptyDirPath)
      .then(() => listFilepaths(emptyDirPath))
      .then(filepaths => {
        expect(filepaths).toEqual(null);
        done();
      })
      .catch(done.fail);
  });

  it('should return null if no filepaths match options.filter', function (done) {
    listFilepaths(this.targetPath, { filter: /finn/ })
      .then(filepaths => {
        expect(filepaths).toEqual(null);
        done();
      })
      .catch(done.fail);
  });

  it('should throw an error for an invalid path', function (done) {
    listFilepaths('invalid/filepath')
      .then(done.fail)
      .catch(err => {
        expect(err.message).toMatch(/ENOENT: no such file or directory/);
        done();
      });
  });
});
