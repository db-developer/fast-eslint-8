'use babel';

import fs                 from "fs";
import os                 from "os";
import path               from "path";
import module             from "module";
import childProcess       from "child_process";
import { ESLint }         from "eslint";
import { IgnorePattern }  from "@eslint/eslintrc";
import { allowUnsafeNewFunction } from 'loophole';

/** @type {ESLint} */
let engine;

let options = { };

const toModulePaths = (projectPaths) => (
  projectPaths.reduce((accumulator, projectPath) => (
    accumulator.concat(module.Module._nodeModulePaths(projectPath))
  ), [])
);

/**
* Installed Nodejs/npm global node_modules directory detection
*/
let nodeLibPath = path.normalize('/usr/local/lib/node_modules');
childProcess.exec('npm config get prefix', (error, stdout) => {
  if (error) return;
  nodeLibPath = path.join(stdout.split('\n')[0], 'lib/node_modules');
});

/**
* Atom currently opened projects module paths
*/
let atomProjectsPaths = toModulePaths(atom.project.rootDirectories.map((project) => project.path));
atom.project.onDidChangePaths((projectPaths) => { atomProjectsPaths = toModulePaths(projectPaths); });

/**
* ESLint ModuleResolver & require() patch with AtomProjectsPaths and NodeLibPath
*/
const oldFindPath = module._findPath;
module._findPath = (name, lookupPaths) => {
  if (lookupPaths.length > 1) {
    lookupPaths = lookupPaths.concat(atomProjectsPaths, nodeLibPath);
  }
  return oldFindPath.call(this, name, lookupPaths);
};

/**
 *  Build paths to locate .eslintrc.* files.
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

export function isIgnored(ignoreFile, filePath) {
  const patterns = fs.readFileSync(ignoreFile, 'utf8')
    .replace(/^\ufeff/u, '')
    .split(/\r?\n/gu)
    .filter((line) => line.trim() !== '' && !line.startsWith('#'));
  const ignorePattern = new IgnorePattern(patterns, path.dirname(ignoreFile));
  const ignoredPaths = IgnorePattern.createIgnore([ignorePattern]);
  return ignoredPaths(filePath);
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
