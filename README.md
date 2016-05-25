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

Return an alphabetically-sorted array of the paths of all files in a directory and return a promise. An `options` object can be passed as a second argument to filter the results or to return relative filepaths.
```javascript
const listFilepaths = require('list-filepaths');

// Inside episode-v
listFilepaths('./ships')
  .then(filepaths => {
    // Process filepaths
    return filepaths;
  })
  .catch(err => {
    // Handle errors
    console.error(err);
  });
// [
//   '/episode-v/ships/millennium-falcon/millennium-falcon.js',
//   '/episode-v/ships/millennium-falcon/pilots/chewbacca.js',
//   '/episode-v/ships/millennium-falcon/pilots/han-solo.js',
//   '/episode-v/ships/slave-i/pilots/boba-fett.js'
//   '/episode-v/ships/slave-i/slave-i.js'
// ]
```

## API
```javascript
const listFilepaths = require('list-filepaths');
```

### listFilepaths(_directoryPath_[, _options_])

Returns an array containing the absolute paths of all files in the target directory and its subdirectories or null if no filepaths are found. Filepaths are sorted alphabetically.

#### directoryPath

type: `String`

The relative or absolute path of the target directory.

#### options.filter(_regex_|_callback_)

##### regex

type: `RegExp`

A regular expression instance against which to `test` each filepath.

##### callback

type: `Function`

A callback function to pass to the Array.prototype.filter method invoked on the final array of filepaths.

#### options.relative(_bool_)

##### bool

type: `Boolean`
default: `false`

Set value to `true` to return a list of relative paths instead of absolute paths.

## License

MIT

[npm-image]: https://img.shields.io/npm/v/list-filepaths.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/list-filepaths
[circleci-image]: https://img.shields.io/circleci/project/bcmarinacci/list-filepaths/master.svg?style=flat-square
[circleci-url]: https://circleci.com/gh/bcmarinacci/list-filepaths/tree/master
[coveralls-image]: https://img.shields.io/coveralls/bcmarinacci/list-filepaths/master.svg?style=flat-square
[coveralls-url]: https://coveralls.io/github/bcmarinacci/list-filepaths?branch=master
