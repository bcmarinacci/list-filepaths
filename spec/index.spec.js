/* eslint-disable prefer-arrow-callback */
'use strict';

const { resolve } = require('path');
const pify = require('pify');
const mkdirp = require('mkdirp');
const listFilepaths = require('../');

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

    const options = {
      filter: /millennium-falcon/
    };

    listFilepaths(this.targetPath, options)
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

  it('should return `null` for empty directories', function (done) {
    const emptyDirPath = 'spec/fixtures/ships/t-47';
    // Create an empty directory to test against
    pify(mkdirp)(emptyDirPath)
      .then(() => listFilepaths(emptyDirPath))
      .then(filepaths => {
        expect(filepaths).toEqual(null);
        done();
      })
      .catch(done.fail);
  });

  it('should return `null` if no filepaths match `options.filter`', function (done) {
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
