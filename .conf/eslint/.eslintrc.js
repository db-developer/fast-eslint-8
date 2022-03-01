module.exports = {
  "root": true,
  "extends": "eslint:recommended",
  "env": {
    "browser": true,
    "es6":  true,
    "node": true
  },
  "globals": {
    "atom": true
  },
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "rules": {
    "function-paren-newline": 0,
    "object-curly-newline": 0,
    "no-underscore-dangle": 0,
    "no-param-reassign": 0,
    "global-require": 0,
    "max-len": 0
  },
  "settings": {
    "import/core-modules": [
      "atom"
    ]
  }
};
