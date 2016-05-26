'use strict';

module.exports = function (pathArr, filterOption) {
  const filepaths = pathArr.filter(element => element !== null);
  if (filterOption instanceof RegExp) {
    return filepaths.filter(pathItem => filterOption.test(pathItem));
  }

  if (filterOption instanceof Function) {
    return filepaths.filter(filterOption);
  }

  return filepaths;
};
