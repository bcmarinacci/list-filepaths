'use strict';

const { readdir, stat } = require('fs');
const { join, resolve } = require('path');
const flattendeep = require('lodash.flattendeep');
const pify = require('pify');
const filterPaths = require('./lib/filter-paths');
const shouldReject = require('./lib/should-reject');

const createPathTree = function (dirPath, options, currentDepth = 0) {
  return pify(stat)(dirPath)
    .then(stats => {
      if (stats.isFile()) {
        // Wrap the path in an array in case a filepath is passed in as the initial value
        return [dirPath];
      }

      if (currentDepth > options.depth) {
        return null;
      }

      return pify(readdir)(dirPath)
        .then(dirChildren => {
          const promiseMap = dirChildren.map(dirChild => {
            const childPath = join(dirPath, dirChild);
            if (shouldReject(childPath, options.reject)) {
              return null;
            }

            return createPathTree(childPath, options, currentDepth + 1);
          });

          return Promise.all(promiseMap);
        });
    });
};

module.exports = function (inputPath, options = {}) {
  const targetPath = options.relative
    ? inputPath
    : resolve(inputPath);

  return createPathTree(targetPath, options)
  .then(pathArr => {
    const filteredPaths = filterPaths(flattendeep(pathArr), options.filter);
    if (!filteredPaths.length) {
      return null;
    }

    return filteredPaths;
  });
};
