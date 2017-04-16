# list-filepaths

[![npm](https://img.shields.io/npm/v/list-filepaths.svg?style=flat-square)]()
[![node](https://img.shields.io/node/v/list-filepaths.svg?style=flat-square)]()
[![CircleCI](https://img.shields.io/circleci/project/github/bcmarinacci/list-filepaths.svg?style=flat-square)]()
[![Coveralls](https://img.shields.io/coveralls/bcmarinacci/list-filepaths.svg?style=flat-square)]()
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

> Asynchronously return an array containing the paths of all files in a directory and its subdirectories


## Install

```bash
$ npm install list-filepaths --save
```

## Usage

For a directory tree...

```bash
└─┬ episode-v
  └─┬ ships
    ├─┬ millennium-falcon
    │ ├── millennium-falcon.js
    │ └─┬ pilots
    │   ├── chewbacca.js
    │   └── han-solo.js
    ├─┬ slave-i
    │ ├─┬ pilots
    │ │ └── boba-fett.js
    │ └── slave-i.js
    └──t-47
```

Return a `Promise` that is resolved with an alphabetically-sorted array of the paths of all files in a directory and its subdirectories. An `options` object can be passed as a second argument to filter the results, reject matching paths, or to return relative file paths instead of absolute file paths.

```javascript
const listFilepaths = require('list-filepaths');

// Inside episode-v
listFilepaths('./ships')
  .then(filepaths => {
    // Process filepaths
    console.log(filepaths);
  })
  .catch(err => {
    // Handle errors
    console.error(err);
  });

// [
//   '/episode-v/ships/millennium-falcon/millennium-falcon.js',
//   '/episode-v/ships/millennium-falcon/pilots/chewbacca.js',
//   '/episode-v/ships/millennium-falcon/pilots/han-solo.js',
//   '/episode-v/ships/slave-i/pilots/boba-fett.js',
//   '/episode-v/ships/slave-i/slave-i.js'
// ]
```

## API

```javascript
const listFilepaths = require('list-filepaths');
```

### listFilepaths(_directoryPath_[, _options_])

Returns a `Promise` that is resolved with an array containing the absolute paths of all files in the target directory and its subdirectories or null if no file paths are found. File paths are sorted alphabetically.

#### directoryPath

- type: `String`

The relative or absolute path of the target directory.

#### options.depth

- type: `Number`

The maximum search depth of the directory tree.

#### options.filter

- type: `RegExp` or `Function`

A regular expression instance against which to `test` each file path or a callback function to pass to the Array.prototype.filter method. The filter option is used on the final array and matching paths are included in the result.

#### options.reject

- type: `RegExp` or `Function`

Similar to filter except matched paths are excluded from the result. Reject is used on each recursive call and, as such, is more efficient than filter as it will skip recursive calls on matching paths.

#### options.relative

- type: `Boolean`

- default: `false`

Set to `true` to return a list of relative paths.
