'use strict';

const { readdir, stat } = require('fs');
const { join, resolve } = require('path');
const flattendeep = require('lodash.flattendeep');
const pify = require('pify');
const filterPaths = require('./lib/filter-paths');

const createPathTree = function (dirPath) {
  return pify(stat)(dirPath)
    .then(stats => {
      if (stats.isFile()) {
        // Return an array to handle a filepath, which skips the recursive call
        return [dirPath];
      }

      return pify(readdir)(dirPath)
        .then(contents => {
          const promiseMap = contents.map(content => createPathTree(join(dirPath, content)));

          return Promise.all(promiseMap);
        });
    });
};

module.exports = function (inputPath, options = {}) {
  const targetPath = options.relative
    ? inputPath
    : resolve(inputPath);

  return createPathTree(targetPath)
  .then(pathArr => {
    const filteredPaths = filterPaths(flattendeep(pathArr), options.filter);
    if (!filteredPaths.length) {
      return null;
    }

    return filteredPaths;
  });
};
