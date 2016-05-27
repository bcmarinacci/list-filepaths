'use strict';

module.exports = function (pathArr, filterOption) {
  const filepaths = pathArr.filter(el => el !== null);
  if (filterOption instanceof RegExp) {
    return filepaths.filter(el => filterOption.test(el));
  }

  if (filterOption instanceof Function) {
    return filepaths.filter(filterOption);
  }

  return filepaths;
};
