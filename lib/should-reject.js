'use strict';

const shouldReject = (str, rejectOption) => {
  if (rejectOption instanceof RegExp) {
    return rejectOption.test(str);
  }

  if (rejectOption instanceof Function) {
    return Boolean(rejectOption(str));
  }

  return false;
};

module.exports = shouldReject;
