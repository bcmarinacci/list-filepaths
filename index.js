'use strict';

const { readdir, stat } = require('fs');
const { join, resolve } = require('path');
const co = require('co');
const flattendeep = require('lodash.flattendeep');
const pify = require('pify');
const filterPaths = require('./lib/filter-paths');
const shouldReject = require('./lib/should-reject');

const createPathTree = module.exports = co.wrap(function* (dirPath, options = {}, currentDepth = 0) {
  const targetPath = options.relative
    ? dirPath
    : resolve(dirPath);

  const stats = yield pify(stat)(targetPath);
  if (stats.isFile()) {
    // Wrap the path in an array in case a filepath is passed in as the initial value
    return [targetPath];
  }

  if (currentDepth > options.depth) {
    return null;
  }

  const dirContents = yield pify(readdir)(targetPath);
  const promisePathTree = dirContents.map(el => {
    const elPath = join(targetPath, el);
    if (shouldReject(elPath, options.reject)) {
      return null;
    }

    return createPathTree(elPath, options, currentDepth + 1);
  });

  const pathTree = yield Promise.all(promisePathTree);
  const pathList = filterPaths(flattendeep(pathTree), options.filter);
  if (!pathList.length) {
    return null;
  }

  return pathList;
});
