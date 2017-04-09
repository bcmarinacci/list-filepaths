'use strict';

const { readdir, stat } = require('fs');
const { join, resolve } = require('path');
const flattendeep = require('lodash.flattendeep');
const filterPaths = require('./lib/filter-paths');
const shouldReject = require('./lib/should-reject');

const readdirAsync = path => new Promise((res, rej) => {
  readdir(path, (err, files) => {
    if (err) {
      rej(err);
    } else {
      res(files);
    }
  });
});

const statAsync = path => new Promise((res, rej) => {
  stat(path, (err, stats) => {
    if (err) {
      rej(err);
    } else {
      res(stats);
    }
  });
});

const createPathTree = async (dirPath, options, currentDepth = 0) => {
  const stats = await statAsync(dirPath);
  if (currentDepth > 0 && stats.isFile()) {
    return [dirPath];
  }

  if (currentDepth > options.depth) {
    return null;
  }

  const files = await readdirAsync(dirPath);
  const promisePathTree = files.map((el) => {
    const elPath = join(dirPath, el);
    if (shouldReject(elPath, options.reject)) {
      return null;
    }

    return createPathTree(elPath, options, currentDepth + 1);
  });

  return Promise.all(promisePathTree);
};

const listFilepaths = async (inputPath, options = {}) => {
  const targetPath = options.relative
    ? inputPath
    : resolve(inputPath);

  const pathTree = await createPathTree(targetPath, options);
  const pathList = flattendeep(pathTree).filter(el => el != null);
  const filteredPathList = filterPaths(pathList, options.filter);
  if (!filteredPathList.length) {
    return null;
  }

  return filteredPathList;
};

module.exports = listFilepaths;
