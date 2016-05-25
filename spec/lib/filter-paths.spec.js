/* eslint-disable prefer-arrow-callback */
'use strict';
const filterPaths = require('../../lib/filter-paths');

const pathList = [
  'ships/millennium-falcon/millennium-falcon.js',
  'ships/millennium-falcon/pilots/chewbacca.js',
  'ships/millennium-falcon/pilots/han-solo.js',
  'ships/slave-i/pilots/boba-fett.js',
  'ships/slave-i/slave-i.js'
];

describe('filterPaths', function () {
  it('should filter a list of filepaths using a regular expression', function () {
    const expectedPathList = [
      'ships/slave-i/pilots/boba-fett.js',
      'ships/slave-i/slave-i.js'
    ];

    const mockFilter = /slave-i/;
    expect(filterPaths(pathList, mockFilter)).toEqual(expectedPathList);
  });

  it('should filter a list of filepaths using a function', function () {
    const expectedPathList = [
      'ships/millennium-falcon/pilots/chewbacca.js',
      'ships/millennium-falcon/pilots/han-solo.js',
      'ships/slave-i/pilots/boba-fett.js',
    ];

    const mockFilter = function (filepath) {
      return /pilots/.test(filepath);
    };

    expect(filterPaths(pathList, mockFilter)).toEqual(expectedPathList);
  });
});
