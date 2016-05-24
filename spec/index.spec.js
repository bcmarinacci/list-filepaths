/* eslint-disable prefer-arrow-callback */
'use strict';

const { resolve } = require('path');
const listFilepaths = require('../');

describe('listFilepaths', function () {
  it('should return an array containing the paths of all files in a directory and its subdirectories', function (done) {
    const expectedPaths = [
      resolve('spec/fixtures/utils/higher-order/for-each/for-each.js'),
      resolve('spec/fixtures/utils/higher-order/map/map.js'),
      resolve('spec/fixtures/utils/print/print.js')
    ];

    listFilepaths('spec/fixtures/utils')
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
