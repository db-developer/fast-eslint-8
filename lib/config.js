/**
 *	config.js: fast-eslint-8
 *  Watch and handle atoms/fast-eslint-8's configuration settings.
 *
 *  @module fast-eslint-8/config
 *
 *//*
 *  © 2022, slashlib.org.
 *
 *  config.js   is  distributed  WITHOUT  ANY  WARRANTY;  without  even  the
 *  implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 *
 */
"use strict";

/**
 *  Module table
 *  @ignore
 */
const _m = Object.seal( Object.freeze({
  lint:             require( "./lint" ),
  util:             require( "./util" )
}));

/**
 *  Stringtable
 *  @ignore
 */
const _STRINGS = Object.seal( Object.freeze({
  BASECONFIG:       "baseconfig",
  DOT:              ".",
  ESLINTCONFIG:     "eslintopts",
  GRAMMARSCOPES:    "grammarScopes",
  GETOPTIONS:       "getOptions",
  INITCONTEXT:      "initContext",
  MISSING_PKGNAME:  "Missing packagename",
  ONACTIVATE:       "onActivate",
  RESETENGINE:      "resetengine",
  SHOULDLINT:       "should-lint"
}));

/**
 *  Stringtable
 *  @ignore
 */
const _CONTEXT = { };

/**
 *  Function required to make testing possible
 */
function initContext( config ) {
  if ( ! config.packagename ) { throw Error( _STRINGS.MISSING_PKGNAME )}
  _CONTEXT.RESETENGINE   = config.packagename + _STRINGS.DOT + _STRINGS.RESETENGINE;
  _CONTEXT.GRAMMARSCOPES = config.packagename + _STRINGS.DOT + _STRINGS.GRAMMARSCOPES;
  _CONTEXT.BASECONFIG    = config.packagename + _STRINGS.DOT + _STRINGS.BASECONFIG;
  _CONTEXT.ESLINTCONFIG  = config.packagename + _STRINGS.DOT + _STRINGS.ESLINTCONFIG;
}

/**
 *  Returns ESLint options and reset status.
 *
 *  This is about 'fast-eslint-8's 'configSchema.eslintopts' (package.json), which is getting
 *  translated into eslint options. Currently supported are:
 *    - 'options.cwd'
 *    - 'options.allowInlineConfig'
 *    - 'options.baseConfig' (see <code>function updateBaseCfg( presets )</code>)
 *    - 'options.overrideConfigFile'
 *    - 'options.reportUnusedDisableDirectives'
 *    - 'options.rulePaths'
 *    - 'options.useEslintrc'
 *  @see [new ESLint( options )](https://eslint.org/docs/developer-guide/nodejs-api#-new-eslintoptions)
 *
 *  @param  {AtomEnvironment} atom      - See [atom flight manual](https://flight-manual.atom.io/api/v1.57.0/AtomEnvironment)
 *  @param  {string}          filepath  - Path and name of file, which is about to be linted.
 *  @param  {ESLint}          engine    - ESLint engine
 *
 *  @returns {Promise} which resolves with ESLint options, if a new ESLint engine needs to be created;
 *           otherwise resolves with undefined or gets rejected with an error, if something really went
 *           wrong.
 *
 *//* eslint-disable-next-line no-unused-vars */
function getOptions( atom, filepath, engine ) {
  return new Promise(( resolve ) => {
    // switch resetengine back to false...
    const resetengine = !! _CONTEXT.RESETENGINE;
                        _CONTEXT.RESETENGINE = false;

    if (( resetengine === true ) || ( atom.project.rootDirectories.length > 1 ) || ( ! engine )) {
          // filter project path for file(path) from array of project root directories
          const projectpath  = _m.util.getProjectPath( filepath, atom.project.rootDirectories );
          const baseconfig   = JSON.parse( JSON.stringify( atom.config.get( _CONTEXT.BASECONFIG   ) || { }));
          const eslintconfig = JSON.parse( JSON.stringify( atom.config.get( _CONTEXT.ESLINTCONFIG ) || { }));

          const options      = { };

          // rebuild options, if engine will be resetted...
          // File enumeration
          if ( eslintconfig.cwd ) { options.cwd = eslintconfig.cwd }
          // options.ignorePath - not yet supported

          // Linting
          options.allowInlineConfig  = ( eslintconfig.allowInlineConfig === false ) ? false : true;

          if (( baseconfig.extends ) && ( baseconfig.extends.length < 1 )) { delete baseconfig.extends }
          options.baseConfig         = ( Object.getOwnPropertyNames( baseconfig ).length > 0 ) ?
                                         baseconfig : null;

          const overrideconfigfile   = eslintconfig.overrideConfigFile;
          options.overrideConfigFile = ( ! overrideconfigfile ) ?
                                         null : _m.util.buildConfigFilePath( overrideconfigfile, projectpath );

          const reportunuseddtives   = eslintconfig.reportUnusedDisableDirectives;
          options.reportUnusedDisableDirectives = ( ! reportunuseddtives ) ? null : reportunuseddtives;

          const rulepaths            = eslintconfig.rulePaths;
          options.rulePaths          = _m.util.buildRulePaths( rulepaths, projectpath ? [ projectpath ] : [ ]);
          options.useEslintrc        = ( eslintconfig.useEslintrc === false ) ? false : true;

          resolve( options );
    }
    else  resolve( undefined );
  });
}

/**
 *  Setup option handling, on package activation.
 *
 *  @param  {AtomEnvironment}     atom
 *  @param  {Object}              config
 *  @param  {Emitter}             emitter
 *  @param  {CompositeDisposable} subscriptions
 *
 *//* eslint-disable-next-line no-unused-vars */
function onActivate( atom, config, emitter, subscriptions ) {
  initContext( config );

  subscriptions.add(
    emitter,
    atom.project.onDidChangePaths((/* paths */) => {
      _CONTEXT.RESETENGINE = true;
    }),
    atom.config.observe( _CONTEXT.GRAMMARSCOPES, ( grammar ) => {
      config.grammmarscopes = grammar;
      // no need to reset engine, cause gramarscopes have been passed by
      // reference to linter provider => linter provider is up to date.
      emitter.emit( _STRINGS.SHOULDLINT, config.grammmarscopes );
    }),
    atom.config.observe( _CONTEXT.BASECONFIG,    (/* presets */) => {
      _CONTEXT.RESETENGINE = true;
      emitter.emit( _STRINGS.SHOULDLINT, config.grammmarscopes );
    }),
    atom.config.observe( _CONTEXT.ESLINTCONFIG,  (/* presets */) => {
      _CONTEXT.RESETENGINE = true;
      emitter.emit( _STRINGS.SHOULDLINT, config.grammmarscopes );
    })
  );
  emitter.on( _STRINGS.SHOULDLINT, _m.lint.triggerReLint );
}

// Module exports:
Object.defineProperty( module.exports, _STRINGS.GETOPTIONS,   {
  value:    getOptions,
  writable: false, enumerable: true, configurable: false });
Object.defineProperty( module.exports, _STRINGS.INITCONTEXT,  {
  value:    initContext,
  writable: false, enumerable: true, configurable: false });
Object.defineProperty( module.exports, _STRINGS.ONACTIVATE,   {
  value:    onActivate,
  writable: false, enumerable: true, configurable: false });
