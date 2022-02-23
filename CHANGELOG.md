# Changelog

All notable changes to this project will be documented in this file.

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
