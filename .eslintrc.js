module.exports = {
  "root": true,
  "extends": "airbnb-base",
  "plugins": [
    "import"
  ],
  "parserOptions": {
    "sourceType": "script"
  },
  "env": {
    "jasmine": true
  },
  "rules": {
    "comma-dangle": ["error", "never"]
  }
};
