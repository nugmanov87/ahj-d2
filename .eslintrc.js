const standardRestrictedGlobals = require('eslint-restricted-globals');
const noRestrictedGlobals = ["error", "isNaN", "isFinite"].concat(standardRestrictedGlobals); 
const noRestrictedGlobalsWorker = noRestrictedGlobals.filter(o => o !== 'self'); 

module.exports = {
    "env": {
      "browser": true,
      "es6": true,
      "jest": true,
      "worker": true
    },
    "extends": [
      "airbnb-base"
    ],
    "globals": {
      "Atomics": "readonly",
      "SharedArrayBuffer": "readonly"
    },
    "parserOptions": {
      "ecmaVersion": 2018,
      "sourceType": "module"
    },
    "rules": {
      "no-restricted-globals": noRestrictedGlobals,
      "no-restricted-syntax": [
        "error",
        "LabeledStatement",
        "WithStatement"
      ],
      "import/extensions": [
        "error",
        "ignorePackages"
      ]
      // "linebreak-style":
      // [
      //   "error",
      //   "windows"
      // ]
    },
    "overrides": [
      {
        "files": ["*.worker.js"],
        "rules": {
          "no-restricted-globals": noRestrictedGlobalsWorker
        }
      }
    ],
  }
