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
    └─┬ slave-i
      ├─┬ pilots
      │ └── boba-fett.js
      └── slave-i.js
```

Return an array containing absolute filepaths of files in a directory and return a promise
```javascript
const listFilepaths = require('list-filepaths');

listFilepaths('episode-v/ships')
  .then(filepaths => filepaths)
  .catch(console.error);
// [
//   '/episode-v/ships/millennium-falcon/millennium-falcon.js',
//   '/episode-v/ships/millennium-falcon/pilots/chewbacca.js',
//   '/episode-v/ships/millennium-falcon/pilots/han-solo.js',
//   '/episode-v/ships/slave-i/pilots/boba-fett.js'
//   '/episode-v/ships/slave-i/slave-i.js'
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
