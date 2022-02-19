'use babel';

import fs                 from "fs";
import os                 from "os";
import path               from "path";
import module             from "module";
import childProcess       from "child_process";
import { ESLint }         from "eslint";
import { IgnorePattern }  from "@eslint/eslintrc";
import { allowUnsafeNewFunction } from "loophole";

const  helpers = require( "atom-linter" );

/** @type {ESLint} */
let engine;

let options = { };

const _STRINGS = {
  EMPTY:      "",
  ERROR:      "error",
  FATAL:      "fatal",
  HASH:       "#",
  UTF8:       "utf8",
  WARNING:    "warning"
}

/**
 *  Detect global node_modules directory from node/npm installation.
 *  @ignore
 */
let nodelibpath = undefined;
childProcess.exec( "npm root -g", ( error, stdout ) => {
  if ( error ) { return; }
  else nodelibpath = path.normalize( stdout.split( os.EOF )[0]);
});

/**
 *  Create 'node_modules' paths from project paths.
 *
 *  @param  {Array<string>} projectpaths - An array of project paths.
 *  @return {Array<string>} of 'node_modules' paths.
 */
function toModulePaths( projectpaths ) {
  return projectpaths.reduce(( accumulator, projectpath ) => (
    accumulator.concat( module.Module._nodeModulePaths( projectpath ))
  ), [])
}

/**
 *  Project paths, currently open/active in atom.
 *  @ignore
 */
let atomprojectpaths= atom.project.rootDirectories.map(( project ) => project.path );

/**
 *  'node_modules' paths for projects currently open/active in atom.
 *  @ignore
 */
let atomprojectnodemodulepaths = toModulePaths( atomprojectpaths );

/**
 *  Register callback to update project paths and 'node_modules' paths.
 */
atom.project.onDidChangePaths(( projectPaths ) => {
  atomprojectpaths           = projectPaths;
  atomprojectnodemodulepaths = toModulePaths( atomprojectpaths )
});

/**
 *  ESLint ModuleResolver & require() patch with AtomProjectsPaths and NodeLibPath
 */
const oldFindPath = module._findPath;
module._findPath = ( name, lookupPaths ) => {
  if ( lookupPaths.length > 1 ) {
       lookupPaths = lookupPaths.concat( atomprojectnodemodulepaths, nodelibpath );
  }
  return oldFindPath.call( this, name, lookupPaths );
};

/**
 *  Build paths to locate .eslintrc.* files.
 *    - normalize absolute paths
 *    - complete relataive paths by prepending project directories
 *    - replace "~" by users homedirectory
 *
 *  @param  {Array<string>} directories - Directory paths from configuration.
 *  @return {Array<string>} absolute directory paths from configuration.
 */
function buildRulePaths( directories ) {
  const rulepaths = [];
  directories.forEach(( directory ) => {
    if ( ! path.isAbsolute( directory )) {
         if ( ! directory.startsWith( "~" )) {
              const dirs = atomprojectpaths.map(( projectdir ) => { return path.join( projectdir, directory )});
              if ( dirs.length > 0 ) { rulepaths.push( ...dirs )}
         }
         else rulepaths.push( path.join( os.homedir(), directory.replace( "~", "." ) ));
    }
    else rulepaths.push( directory );
  });
  return rulepaths;
}

/**
 *  Initialize a linter run on a single file.
 *
 *  @see    [ESLint.lintText](https://eslint.org/docs/developer-guide/nodejs-api#-eslintlinttextcode-options)
 *
 *  @param  {string}  filePath  - File path that is passed to ESLint.lintText as part of the options parameter.
 *  @param  {string}  fileText  - Code provided by 'filePath'
 *
 *  @return {Promise} which resolves with eslinter results, or is rejected with an error.
 */
export function exec( filePath, fileText ) {
  return new Promise(( resolve ) => {
    try   {
      if ( ! engine ) { allowUnsafeNewFunction(() => { engine = new ESLint( options )})}
      allowUnsafeNewFunction(() => { resolve( engine.lintText( fileText, { filePath }))})}
    catch ( error ) {
      // Rather than displaying a big error, treat the error as a normal lint error so it shows
      // in the footer rather than a pop-up toast error message.
      resolve({ results: [{ messages: [{ line: 1, message: error, ruleId: NaN, severity: 2 }]}]});
    }
  });
}

export function isIgnored( ignoreFile, filePath ) {
  const patterns = fs.readFileSync( ignoreFile, _STRINGS.UTF8 )
    .replace( /^\ufeff/u, _STRINGS.EMPTY )
    .split( /\r?\n/gu )
    .filter(( line ) => line.trim() !== _STRINGS.EMPTY && !line.startsWith( _STRINGS.HASH ));
  const  ignorePattern = new IgnorePattern( patterns, path.dirname( ignoreFile ));
  const  ignoredPaths  = IgnorePattern.createIgnore([ ignorePattern ]);
  return ignoredPaths( filePath );
}

/**
 *  Handle the report returned by a linter-run on some file.
 */
export function handle( TextEditor, report ) {
  if ( !report || !report.results || !report.results.length ) return [];

  return report.results[ 0 ].messages.map(({ column = 1, line, message, ruleId, severity, fix }) => {
    const lineLength = TextEditor.getBuffer().lineLengthForRow( line - 1 );
    const colStart   = ( column - 1 > lineLength ) ? ( lineLength + 1 ) : column;
    const position   = helpers.generateRange( TextEditor, line - 1, colStart - 1 );
    const file       = TextEditor.getPath();

    return {
      severity:   severity === 1 ? _STRINGS.WARNING : _STRINGS.ERROR,
      excerpt:    `${ ruleId || _STRINGS.FATAL }: ${ message }`,
      solutions:  fix ? [{
        position: new Range(
          fileBuffer.positionForCharacterIndex( fix.range[ 0 ]),
          fileBuffer.positionForCharacterIndex( fix.range[ 1 ]),
        ),
        replaceWith: fix.text,
      }] : null,
      location: { file, position }
    };
  });
}

/**
 *  This is about 'fast-eslint-8's 'configSchema.baseConfigExtends' (package.json), which is getting
 *  translated into eslint 'options.baseConfig'.
 *  @see [new ESLint( options )](https://eslint.org/docs/developer-guide/nodejs-api#-new-eslintoptions)
 *
 *  Obviously the base configuration has changed. Save the new state and reset the linter engine.
 *  Next time the linter might be invoked, it will create a new linter engine (see function 'exec').
 *
 *  @param  {Array<string>} presets - An array of strings, each string must be the name of a base
 *                                    configuration.
 *  @param  {Array<string>} grammar
 *
 */
export function updateBaseCfg( presets ) {
  options.baseConfig  = ( presets.length === 0 ) ? null : { extends: presets };

  // options have changed, so reset the linter engine.
  engine = undefined;
}

/**
 *  This is about 'fast-eslint-8's 'configSchema.eslintrc' (package.json), which is getting
 *  translated into eslint
 *    - 'options.useEslintrc'
 *    - 'options.overrideConfigFile'
 *    - 'options.rulePaths'
 *  @see [new ESLint( options )](https://eslint.org/docs/developer-guide/nodejs-api#-new-eslintoptions)
 *
 *  Obviously the eslint configuration has changed. Save the new state and reset the linter engine.
 *  Next time the linter might be invoked, it will create a new linter engine (see function 'exec').
 *
 *  @param  {object}        presets
 *  @param  {boolean}       [presets.useEslintrc]         - See 'options.useEslintrc' of new ESLint( options )
 *  @param  {string}        [presets.overrideConfigFile]  - See 'options.overrideConfigFile' of new ESLint( options )
 *  @param  {Array<string>} [presets.rulePaths]           - See 'options.rulePaths' of new ESLint( options )
 *  @param  {Array<string>} grammar
 *
 */
export function updateEslintCfg( presets, grammar ) {
  options.useEslintrc         = ( presets.useEslintrc === true ) ? true : false;
  options.overrideConfigFile  = ( presets.overrideConfigFile ) ? presets.overrideConfigFile : null;
  options.rulePaths           = buildRulePaths( presets.rulePaths );

  // options have changed, so reset the linter engine.
  engine = undefined;
}
