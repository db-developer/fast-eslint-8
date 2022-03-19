# Changelog

All notable changes to this project will be documented in this file.

## [5.1.3](https://github.com/db-developer/fast-eslint-8/compare/v5.1.2...v5.1.3) - 2022-03-19

### Added

- Some test suites
- Some docs

### Changed

- Made linter follow 'grammar scopes' (settings) without having to restart atom.
- Removed "use babel" from code and switched modules to cjs.
- Moved functions to support-modules.  
  Preparation for moving code to a 'support' library, so future 'fast-eslint-9' and current 'fast-eslint-8'
  can use the same fully tested and functional support library.

### Fixed

- Removed linting content of texteditors, which were neither visible nor part of the current project.  
  Linting is incorrectly triggered by package 'linter' on 'auto lint files' on 'project change' and happens
  when switching between projects, with more than one entry in <code>project.rootDirectories</code>.

### Removed

- module loading tweak for global node_modules.  
  This was used, to enable atom to load packages like <code>eslint-config-standard</code>,
  <code>eslint-config-standard-react</code>, <code>eslint-config-airbnb</code> and others,
  that were globally installed.  
  I removed this for security reasons and to reduce interferences between apm and npm and
  finally because the packages named above, can be installed by simply using apm.

## [5.1.2](https://github.com/db-developer/fast-eslint-8/compare/v5.1.1...v5.1.2) - 2022-03-01

### Added

- .eslintrc.js in directory .conf for use by fast-eslint-8 'overrideConfigFile'.

### Changed

- READEME.md now provides some status badges.
- READEME.md now provides information about fast-eslint-8 settings in atom.

### Fixed

- Adjusted filepath handling for ESLint engine option 'rulePaths' and 'overrideConfigFile'

## [5.1.1](https://github.com/db-developer/fast-eslint-8/compare/v5.1.0...v5.1.1) - 2022-02-23

### Fixed

- [#5](https://github.com/db-developer/fast-eslint-8/issues/5) .eslintignore results in Error


## [5.1.0](https://github.com/db-developer/fast-eslint-8/compare/v5.0.2...v5.1.0) - 2022-02-23

### Breaking changes
Due to the following changes to <code>configSchema</code>, old settings for fast-eslint-8 must be transferred to new
property fields.

- Moved 'configSchema.baseConfigExtends' in 'package.json' to 'configSchema.baseconfig.extends'.  
  (This opens up the opportunity for adding further configurable baseconfig settings)
- Moved 'configSchema.eslintrc' in 'package.json' to 'configSchema.eslintopts'.  
  (Naming adapted to ESLint engine options, which are different from eslintrc properties)

### Issues

- [#4](https://github.com/db-developer/fast-eslint-8/issues/4) Changing settings [...] does not trigger re-lint for
  open editors.

### Added

- Added more options to 'configSchema.eslintopts'  
  Note: Options which modify the behaviour of
  [eslint.lintFiles()](https://eslint.org/docs/developer-guide/nodejs-api#-eslintlintfilespatterns)
  will remain unsupported, because fast-eslint-8 does not make use of that function.
- Added trigger for re-linting content of open texteditors on configuration change.  


## [5.0.2](https://github.com/db-developer/fast-eslint-8/compare/v5.0.1...v5.0.2) - 2022-02-20

Some cosmetic updates.

### Fixed

- [Linter] further errors now will be displayed as linter errors.

## [5.0.1](https://github.com/db-developer/fast-eslint-8/compare/v5.0.0...v5.0.1) - 2022-02-19

### Fixed

- [Linter] Error running ESLint Error: No ESLint configuration found in ...\fast-eslint-8\lib

### Added

- Configurable directory location for .eslintrc.* files.

## [5.0.0] - 2022-02-19

Initial 'impatience" version based on
[fast-eslint 4.15.0 by Arnaud Dezandee](https://github.com/arnaud-dezandee/fast-eslint) (2020-10-09).

### Fixed

- Switched from CLIEngine to ESLint  
  [CLIEngine removed](https://eslint.org/docs/8.0.0/user-guide/migrating-to-8.0.0#-the-cliengine-class-has-been-removed)
- IgnorePattern has moved to <code>@eslint/eslintrc</code>
- Switched atom config from 'fast-eslint' to 'fast-eslint-8'

### Bugs

- [Linter] Error running ESLint Error: No ESLint configuration found in ...\fast-eslint-8\lib
