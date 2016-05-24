'use strict';

const { readdir, stat } = require('fs');
const { join, resolve } = require('path');
const flattendeep = require('lodash.flattendeep');
const pify = require('pify');

const listFilepaths = module.exports = function (dirPath, options = {}) {
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
        .then(pathArr => {
          const filter = options.filter;
          const flattenedPathArr = flattendeep(pathArr);
          if (filter instanceof Function) {
            return flattenedPathArr.filter(filter);
          }

          if (filter instanceof RegExp) {
            return flattenedPathArr.filter(pathItem => filter.test(pathItem));
          }

          return flattenedPathArr;
        });
    });
};
