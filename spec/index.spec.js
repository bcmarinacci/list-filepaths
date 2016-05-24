/* eslint-disable prefer-arrow-callback */
'use strict';

const { resolve } = require('path');
const listFilepaths = require('../');

describe('listFilepaths', function () {
  it('should return an array containing the paths of all files in a directory and its subdirectories', function (done) {
    const expectedPaths = [
      resolve('spec/fixtures/ships/millennium-falcon/millennium-falcon.js'),
      resolve('spec/fixtures/ships/millennium-falcon/pilots/chewbacca.js'),
      resolve('spec/fixtures/ships/millennium-falcon/pilots/han-solo.js'),
      resolve('spec/fixtures/ships/slave-i/pilots/boba-fett.js'),
      resolve('spec/fixtures/ships/slave-i/slave-i.js')
    ];

    listFilepaths('spec/fixtures/ships')
      .then(filepaths => {
        expect(expectedPaths.length).toEqual(filepaths.length);
        expect(expectedPaths).toEqual(filepaths);
        done();
      })
      .catch(done.fail);
  });

  it('should optionally filter the list of filepaths using a regular expression', function (done) {
    const expectedPaths = [
      resolve('spec/fixtures/ships/slave-i/pilots/boba-fett.js'),
      resolve('spec/fixtures/ships/slave-i/slave-i.js')
    ];

    const options = {
      filter: /slave-i/
    };

    listFilepaths('spec/fixtures/ships', options)
      .then(filepaths => {
        expect(expectedPaths.length).toEqual(filepaths.length);
        expect(expectedPaths).toEqual(filepaths);
        done();
      })
      .catch(done.fail);
  });

  it('should optionally filter the list of filepaths using a function', function (done) {
    const expectedPaths = [
      resolve('spec/fixtures/ships/millennium-falcon/pilots/chewbacca.js'),
      resolve('spec/fixtures/ships/millennium-falcon/pilots/han-solo.js'),
      resolve('spec/fixtures/ships/slave-i/pilots/boba-fett.js'),
    ];

    const options = {
      filter(filepath) {
        return /pilots/.test(filepath);
      }
    };

    listFilepaths('spec/fixtures/ships', options)
      .then(filepaths => {
        expect(expectedPaths.length).toEqual(filepaths.length);
        expect(expectedPaths).toEqual(filepaths);
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
