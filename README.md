# list-filepaths

[![NPM Version][npm-image]][npm-url]
[![Build Status][circleci-image]][circleci-url]
[![Coverage Status][coveralls-image]][coveralls-url]

> Asynchronously list the paths of all files in a directory and its subdirectories

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

## License

MIT

[npm-image]: https://img.shields.io/npm/v/list-filepaths.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/list-filepaths
[circleci-image]: https://img.shields.io/circleci/project/bcmarinacci/list-filepaths/master.svg?style=flat-square
[circleci-url]: https://circleci.com/gh/bcmarinacci/list-filepaths/tree/master
[coveralls-image]: https://img.shields.io/coveralls/bcmarinacci/list-filepaths/master.svg?style=flat-square
[coveralls-url]: https://coveralls.io/github/bcmarinacci/list-filepaths?branch=master
