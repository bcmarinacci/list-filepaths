'use strict';

const { readdir, stat } = require('fs');
const { join, resolve } = require('path');
const flattendeep = require('lodash.flattendeep');
const pify = require('pify');
const filterPaths = require('./lib/filter-paths');

const createPathTree = function (dirPath, targetDepth, currentDepth = -1) {
  return pify(stat)(dirPath)
    .then(stats => {
      if (stats.isFile()) {
        // Wrap the path in an array in case a filepath is passed in as the initial value
        return [dirPath];
      }

      if (currentDepth === targetDepth) {
        return null;
      }

      return pify(readdir)(dirPath)
        .then(dirChildren => {
          const promiseMap = dirChildren.map(dirChild => {
            const childPath = join(dirPath, dirChild);

            return createPathTree(childPath, targetDepth, currentDepth + 1);
          });

          return Promise.all(promiseMap);
        });
    });
};

module.exports = function (inputPath, options = {}) {
  const targetPath = options.relative
    ? inputPath
    : resolve(inputPath);

  return createPathTree(targetPath, options.depth)
  .then(pathArr => {
    const filepaths = flattendeep(pathArr).filter(element => element !== null);
    const filteredPaths = filterPaths(filepaths, options.filter);
    if (!filteredPaths.length) {
      return null;
    }

    return filteredPaths;
  });
};
