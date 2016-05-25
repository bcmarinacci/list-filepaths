/* eslint-disable prefer-arrow-callback */
'use strict';

const { resolve } = require('path');
const listFilepaths = require('../');

describe('listFilepaths', function () {
  it('should return an array containing the absolute paths of all files in a directory and its subdirectories', function (done) {
    const expectedPathList = [
      resolve('spec/fixtures/ships/millennium-falcon/millennium-falcon.js'),
      resolve('spec/fixtures/ships/millennium-falcon/pilots/chewbacca.js'),
      resolve('spec/fixtures/ships/millennium-falcon/pilots/han-solo.js'),
      resolve('spec/fixtures/ships/slave-i/pilots/boba-fett.js'),
      resolve('spec/fixtures/ships/slave-i/slave-i.js')
    ];

    listFilepaths('spec/fixtures/ships')
      .then(filepathArr => {
        expect(filepathArr.length).toEqual(expectedPathList.length);
        expect(filepathArr).toEqual(expectedPathList);
        done();
      })
      .catch(done.fail);
  });

  it('should handle a filepath', function (done) {
    const expectedPathList = [resolve('spec/fixtures/ships/slave-i/slave-i.js')];

    listFilepaths('spec/fixtures/ships/slave-i/slave-i.js')
      .then(filepathArr => {
        expect(filepathArr.length).toEqual(expectedPathList.length);
        expect(filepathArr).toEqual(expectedPathList);
        done();
      })
      .catch(done.fail);
  });

  it('should return `null` for empty directories', function (done) {
    listFilepaths('spec/fixtures/ships/t-47')
      .then(filepathArr => {
        expect(filepathArr).toEqual(null);
        done();
      })
      .catch(done.fail);
  });

  it('should return `null` if no filepaths match `options.filter`', function (done) {
    listFilepaths('spec/fixtures/ships', { filter: /finn/ })
      .then(filepathArr => {
        expect(filepathArr).toEqual(null);
        done();
      })
      .catch(done.fail);
  });

  it('should optionally return an array containing the relative paths of all files in a directory and its subdirectories', function (done) {
    const expectedPathList = [
      'spec/fixtures/ships/millennium-falcon/millennium-falcon.js',
      'spec/fixtures/ships/millennium-falcon/pilots/chewbacca.js',
      'spec/fixtures/ships/millennium-falcon/pilots/han-solo.js',
      'spec/fixtures/ships/slave-i/pilots/boba-fett.js',
      'spec/fixtures/ships/slave-i/slave-i.js'
    ];

    listFilepaths('spec/fixtures/ships', { relative: true })
      .then(filepathArr => {
        expect(filepathArr.length).toEqual(expectedPathList.length);
        expect(filepathArr).toEqual(expectedPathList);
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
