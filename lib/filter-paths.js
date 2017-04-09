'use strict';

const filterPaths = (pathArr, filterOption) => {
  if (filterOption instanceof RegExp) {
    return pathArr.filter(el => filterOption.test(el));
  }

  if (filterOption instanceof Function) {
    return pathArr.filter(filterOption);
  }

  return pathArr;
};

module.exports = filterPaths;
