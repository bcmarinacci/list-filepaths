'use strict';

module.exports = function (str, rejectOption) {
  if (rejectOption instanceof RegExp) {
    return rejectOption.test(str);
  }

  if (rejectOption instanceof Function) {
    return Boolean(rejectOption(str));
  }

  return false;
};
