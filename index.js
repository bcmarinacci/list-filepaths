'use strict';

const { readdir, stat } = require('fs');
const { join, resolve } = require('path');
const flattendeep = require('lodash.flattendeep');
const pify = require('pify');

const listFilepaths = module.exports = function (dirPath) {
  return pify(stat)(dirPath)
    .then(stats => {
      if (stats.isFile()) {
        return resolve(dirPath);
      }

      return pify(readdir)(dirPath)
        .then(contents => {
          const promiseMap = contents.map(content => listFilepaths(join(dirPath, content)));

          return Promise.all(promiseMap);
        })
        .then(pathArr => flattendeep(pathArr));
    });
};
