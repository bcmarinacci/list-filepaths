'use strict';

const { readdir, stat } = require('fs');
const { join, resolve } = require('path');
const co = require('co');
const flattendeep = require('lodash.flattendeep');
const filterPaths = require('./lib/filter-paths');
const shouldReject = require('./lib/should-reject');

const readdirAsync = function (path) {
  return new Promise((res, rej) => {
    readdir(path, (err, files) => {
      if (err) {
        rej(err);
      } else {
        res(files);
      }
    });
  });
};

const statAsync = function (path) {
  return new Promise((res, rej) => {
    stat(path, (err, stats) => {
      if (err) {
        rej(err);
      } else {
        res(stats);
      }
    });
  });
};

const createPathTree = module.exports = co.wrap(function* (dirPath, options, currentDepth = 0) {
  const stats = yield statAsync(dirPath);
  if (currentDepth > 0 && stats.isFile()) {
    return [dirPath];
  }

  if (currentDepth > options.depth) {
    return null;
  }

  const files = yield readdirAsync(dirPath);
  const promisePathTree = files.map(el => {
    const elPath = join(dirPath, el);
    if (shouldReject(elPath, options.reject)) {
      return null;
    }

    return createPathTree(elPath, options, currentDepth + 1);
  });

  return Promise.all(promisePathTree);
});

module.exports = co.wrap(function* (inputPath, options = {}) {
  const targetPath = options.relative
    ? inputPath
    : resolve(inputPath);

  const pathTree = yield createPathTree(targetPath, options);
  const pathList = flattendeep(pathTree).filter(el => el != null);
  const filteredPathList = filterPaths(pathList, options.filter);
  if (!filteredPathList.length) {
    return null;
  }

  return filteredPathList;
});
