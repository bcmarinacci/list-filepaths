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
└─┬ Users
  └─┬ finn
    └─┬ ships
      ├─┬ millennium-falcon
      │ ├── millennium-falcon.js
      │ └─┬ pilots
      │   ├── chewbacca.js
      │   └── han-solo.js
      └─┬ slave-i
        ├─┬ pilots
        │ └── jango-fett.js
        └── slave-i.js
```

List absolute filepaths of files in a directory
```javascript
const listFilepaths = require('list-filepaths');

listFilepaths('/ships');
// [
//   '/Users/finn/ships/millennium-falcon/millennium-falcon.js',
//   '/Users/finn/ships/millennium-falcon/pilots/chewbacca.js',
//   '/Users/finn/ships/millennium-falcon/pilots/han-solo.js',
//   '/Users/finn/ships/slave-i/pilots/jango-fett.js'
//   '/Users/finn/ships/slave-i/slave-i.js'
// ]
```

## License

MIT

[npm-image]: https://img.shields.io/npm/v/list-filepaths.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/list-filepaths
[circleci-image]: https://img.shields.io/circleci/project/bcmarinacci/list-filepaths/master.svg?style=flat-square
[circleci-url]: https://circleci.com/gh/bcmarinacci/list-filepaths/tree/master
[coveralls-image]: https://img.shields.io/coveralls/bcmarinacci/list-filepaths/master.svg?style=flat-square
[coveralls-url]: https://coveralls.io/github/bcmarinacci/list-filepaths?branch=master
