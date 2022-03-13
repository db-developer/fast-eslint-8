# fast-eslint-8 package

Lightweight eslint v8.x linter plugin for [Atom](https://atom.io), based on fast-eslint.  

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![APM](https://img.shields.io/apm/v/fast-eslint-8)](https://atom.io/packages/fast-eslint-8)
[![GitHub Release Date](https://img.shields.io/github/release-date/db-developer/fast-eslint-8?color=blue)](https://github.com/db-developer/fast-eslint-8)
[![APM](https://img.shields.io/apm/dm/fast-eslint-8?color=blue)](https://atom.io/packages/fast-eslint-8)
[![eslint](https://img.shields.io/badge/dynamic/json?url=https://raw.githubusercontent.com/db-developer/fast-eslint-8/master/package.json&label=eslint&query=$.dependencies.eslint&color=darkgreen)](https://eslint.org)

fast-eslint-8 is a migration of [fast-eslint](https://github.com/arnaud-dezandee/fast-eslint/) from using
eslint 7.10 to eslint 8.x (see badge for current version).  

Eslint v8.x is bundled with this package and works "out of the box".  
It is NOT necessary to install eslint globally or inside your project.

Many thanks to Arnaud Dezandee, who is the creator of [fast-eslint](https://github.com/arnaud-dezandee/fast-eslint/). This migration would not have been able without his project. Feel free to copy the changed code and reintegrate it into fast-eslint.

# Table of Contents

1. Installation
  - [User-friendly](docs/atom.fast-eslint-8.install.md#user-friendly)
  - [Advanced (apm)](docs/atom.fast-eslint-8.install.md#advanced)
2. Configuration  
  - [User-friendly, by using atom settings](docs/atom.fast-eslint-8.settings.md)
  - [Advanced, by editing atoms configuration](docs/atom.fast-eslint-8.config.md)
3. [Updating fast-eslint-8](docs/atom.fast-eslint-8.updating.md)
4. [Using popular styleguides with eslint, like airbnb, google and others](docs/eslint.styleguides.md)
5. [Most bugging error messages](#most-bugging-error-messages)

___

Please follow the links in 'table of contents' to install, configure and update.  
___

## Most bugging error messages

### No ESLint configuration found in &lt;filename&gt;

![eslint no configuration found](https://user-images.githubusercontent.com/2765933/158055125-f7196053-4a8c-4b21-a927-196517b08ce7.png)

You simply forgot to provide an .eslintrc.* file in the named directory.  
If you choose to provide an .eslintrc.js file, its content might look as follows:  

```javascript
/**
 *  .eslintrc.js - eslint configuration file
 *  @ignore
 */
module.exports = {
  "extends": "eslint:recommended",
  "env": {
    "browser": true,
    "es6":  true,
    "node": true
  },
  "parserOptions": {
    "ecmaVersion": "latest"
  }
};

```  

Follow the link, to:
* [read more on .eslintrc.* files](https://eslint.org/docs/user-guide/configuring)
* [read more on jsdoc comments](https://jsdoc.app)
