'use strict';

const fs = require('fs');
const path = require('path');
const flattendeep = require('lodash.flattendeep');
const filterPaths = require('./lib/filter-paths');
const shouldReject = require('./lib/should-reject');

const readdirAsync = dirpath =>
  new Promise((resolve, reject) => {
    fs.readdir(dirpath, (err, files) => {
      if (err) {
        reject(err);
      } else {
        resolve(files);
      }
    });
  });

const statAsync = targetpath =>
  new Promise((resolve, reject) => {
    fs.stat(targetpath, (err, stats) => {
      if (err) {
        reject(err);
      } else {
        resolve(stats);
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
  const promisePathTree = files.map(el => {
    const elPath = path.join(dirPath, el);
    if (shouldReject(elPath, options.reject)) {
      return null;
    }

    return createPathTree(elPath, options, currentDepth + 1);
  });

  return Promise.all(promisePathTree);
};

const listFilepaths = async (inputPath, options = {}) => {
  const targetPath = options.relative ? inputPath : path.resolve(inputPath);

  const pathTree = await createPathTree(targetPath, options);
  const pathList = flattendeep(pathTree).filter(el => el != null);
  const filteredPathList = filterPaths(pathList, options.filter);
  if (!filteredPathList.length) {
    return null;
  }

  return filteredPathList;
};

module.exports = listFilepaths;
