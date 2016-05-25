'use strict';

module.exports = function (pathArr, filterOption) {
  if (filterOption instanceof RegExp) {
    return pathArr.filter(pathItem => filterOption.test(pathItem));
  }

  if (filterOption instanceof Function) {
    return pathArr.filter(filterOption);
  }

  return pathArr;
};
