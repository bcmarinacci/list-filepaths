'use strict';

const { readdir, stat } = require('fs');
const { join, resolve } = require('path');
const flattendeep = require('lodash.flattendeep');
const pify = require('pify');

const listFilepaths = module.exports = function (dirPath) {
  const absolutePath = resolve(dirPath);
  return pify(stat)(absolutePath)
    .then(stats => {
      if (stats.isFile()) {
        return absolutePath;
      }

      return pify(readdir)(absolutePath).then(contents => {
        const promiseMap = contents.map(content => listFilepaths(join(absolutePath, content)));
        return Promise.all(promiseMap);
      });
    })
    .then(pathStrOrArr => {
      if (Array.isArray(pathStrOrArr)) {
        return flattendeep(pathStrOrArr);
      }

      return pathStrOrArr;
    });
};
