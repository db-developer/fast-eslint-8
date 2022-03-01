'use babel';

import   fs                       from "fs";
import   os                       from "os";
import   path                     from "path";
import   module                   from "module";
import   childProcess             from "child_process";
import { Range                  } from "atom";
import { ESLint }                 from "eslint";
import { Legacy }                 from "@eslint/eslintrc";
import { allowUnsafeNewFunction } from "loophole";
const    helpers                  = require( "atom-linter" );
const    IgnorePattern            = Legacy.IgnorePattern;

/** @type {ESLint} */
let engine = undefined;

let options = { };

/**
 *  timer handle - see function 'triggerReLint'
 *  @ignore
 */
let relinttrigger = undefined;

/**
 *  Stringtable
 *  @ignore
 */
const _STRINGS = {
  CMD_NPM:    "npm root -g",
  DOT:        ".",
  EMPTY:      "",
  ERROR:      "error",
  FATAL:      "fatal",
  HASH:       "#",
  TILDE:      "~",
  UTF8:       "utf8",
  WARNING:    "warning"
};

/**
 *  Detect global node_modules directory from node/npm installation.
 *  @ignore
 */
let nodelibpath = undefined;
childProcess.exec( _STRINGS.CMD_NPM, ( error, stdout ) => {
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
  return projectpaths.reduce(( accumulator, projectpath ) => {
    if (( projectpath !== undefined ) && ( projectpath !== null ))  {
          accumulator.concat( module.Module._nodeModulePaths( projectpath ));
    }
    return accumulator;
  }, []);
}

/**
 *  Make sure paths do not contain entries, which  are 'null' or 'undefined'.
 */
function cleanPaths( paths = []) {
  return paths.filter(( path ) => ( path !== null ) && ( path !== undefined ));
}

/**
 *  Project paths, currently open/active in atom and required by setting up
 *  eslint rule paths.
 *  @ignore
 */
let atomprojectpaths = cleanPaths( atom.project.getPaths());

/**
 *  'node_modules' paths for projects currently open/active in atom.
 *  @ignore
 */
let atomprojectnodemodulepaths = toModulePaths( atomprojectpaths );

/**
 *  ESLint ModuleResolver & require() patch with AtomProjectsPaths and NodeLibPath
 */
const oldFindPath = module._findPath;
module._findPath = ( name, lookupPaths ) => {
  if ( lookupPaths.length > 1 ) {
       lookupPaths = lookupPaths.concat( atomprojectnodemodulepaths );
  }
  if ( nodelibpath ) {
       lookupPaths = lookupPaths.concat( nodelibpath );
  }
  return oldFindPath.call( this, name, lookupPaths );
};

/**
 *  Build an array of paths
 *    - normalize absolute paths
 *    - complete relataive paths by prepending project directories
 *    - replace "~" by users homedirectory
 *
 *  @param  {string}        directory     - An absolute or relative directory
 *  @param  {Array<string}  projectpaths  - An array of project paths, which will be prepended to 'directory',
 *                                          in case its neither absolute nor a user home directory.
 *  @param  {Array<string}  patharray     - An array, which holds the results from building paths.
 *
 *  @param  {Array<string} patharray
 */
function buildPath( directory, projectpaths, patharray = []) {
  if ( ! path.isAbsolute( directory )) {
       if ( ! directory.startsWith( _STRINGS.TILDE )) {
            const dirs = projectpaths.map(( projectdir ) => { return path.join( projectdir, directory )});
            if ( dirs.length > 0 ) { patharray.push( ...dirs )}
       }
       else patharray.push( path.join( os.homedir(), directory.replace( _STRINGS.TILDE, _STRINGS.DOT )));
  }
  else patharray.push( directory );
  return patharray;
}

/**
 *  Build an array of paths to locate linter rules.
 *  See <code>function buildPath( directory )</code> for path building details.
 *  See https://eslint.org/docs/developer-guide/working-with-rules
 *
 *  @param  {Array<string>} directories - Directory paths from configuration.
 *  @return {Array<string>} absolute directory paths from configuration.
 */
function buildRulePaths( directories ) {
  const rulepaths = [];
  directories.forEach(( directory ) => {
    buildPath( directory, atomprojectpaths, rulepaths );
  });
  return rulepaths;
}

/**
 *  Builds an absolute filepath to an .eslintrc.* configuration file.
 *  See <code>function buildPath( directory )</code> for path building details.
 *
 *  @param  {string|null} filepath  - An absolute or relative path AND filename of an .eslintrc.* configuration file.
 *
 *  @return {string|null} an absolute path to an .eslintrc.* configuration file.
 */
function buildConfigFilePath( filepath ) {
  if ( filepath ) {
       const projectpaths = atomprojectpaths.length > 0 ? [ atomprojectpaths[ 0 ]] : [];
       return buildPath( filepath, projectpaths )[ 0 ];
  }
  else return null;
}

/**
 *  Check atom for open editors and initialize a new linter run for each editor.
 *  This method is usually called
 *    - after eslinter configuration changes
 *
 *  @param  {Array<string>} grammar
 */
function relintOnTimer( grammar ) {
  // Note:
  // Both targets (see below: workspace & editor views) can perfectly be run using the developer
  // console and both DO trigger a re-linting...
  // Nevertheless, when run from within this function, nothing happens *gnarf*.
  //
  // I tried to add an indirection by using a timer => no success
  // I tried to add another indirection by introducing an event emitter in index.js => no success
  //
  // ... I'm out of ideas, which means: a change in linter settings currently won't trigger a
  // linter run for open editors. Editors have to be closed and re-opened or editor content hast
  // to be touched (ärks!) to re-lint.
  //
  // If you have any idea, please comment https://github.com/db-developer/fast-eslint-8/issues/4

  /*
  console.log( "trigger 'runLinter' for workspace" );
  const target = atom.views.getView( atom.workspace );
  atom.commands.dispatch( target, "linter:lint:true" );
  */

  let editors = [];
  for ( let editor of atom.workspace.getTextEditors()) {
        if ( grammar.includes( editor.getGrammar().scopeName )) {
             editors.push( editor );
      }
  }
  editors.forEach(( editor ) => {
    let view = atom.views.getView( editor );
    console.log( "trigger 'runLinter' for view" );
    return atom.commands.dispatch( view, "linter:lint" );
  });
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
  console.log( "linter called" )
  return new Promise(( resolve, reject ) => {
    try   {
      if ( ! engine ) {
           allowUnsafeNewFunction(() => {
             engine = new ESLint( options );
             resolve( engine );
           });
      }
      else resolve( engine );
    }
    catch ( error ) { reject( error )}
  })
  .then(( engine ) => {
    return new Promise(( resolve, reject ) => {
      allowUnsafeNewFunction(() => {
        engine.lintText( fileText, { filePath })
              .then(( result ) => { resolve({ results: result })},
                    ( error  ) => { reject( error )});
      });
    });
  })
  .catch(( error ) => {
    // Rather than displaying a big error, treat the error as a normal lint error so it shows
    // in the footer rather than a pop-up toast error message.
    return Promise.resolve({ results: [{ messages: [{ line: 1, message: error, ruleId: NaN, severity: 2 }]}]});
  });
}

/**
 *  Handle the report returned by a linter-run on some file.
 */
export function handle( texteditor, report ) {
  if ( !report || !report.results || !report.results.length ) return [];

  return report.results[ 0 ].messages.map(({ column = 1, line, message, ruleId, severity, fix }) => {
    const fileBuffer = texteditor.getBuffer();
    const lineLength = texteditor.getBuffer().lineLengthForRow( line - 1 );
    const colStart   = ( column - 1 > lineLength ) ? ( lineLength + 1 ) : column;
    const position   = helpers.generateRange( texteditor, line - 1, colStart - 1 );
    const file       = texteditor.getPath();

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
 *  Read patterns from 'ignorefile' (.eslintignore) and return true,
 *  if ignored paths contain 'filepath'.
 */
export function isIgnored( ignorefile, filepath ) {
  const patterns = fs.readFileSync( ignorefile, _STRINGS.UTF8 )
    .replace( /^\ufeff/u, _STRINGS.EMPTY )
    .split( /\r?\n/gu )
    .filter(( line ) => line.trim() !== _STRINGS.EMPTY && !line.startsWith( _STRINGS.HASH ));
  const  ignorepattern = new IgnorePattern( patterns, path.dirname( ignorefile ));
  const  ignoredPaths  = IgnorePattern.createIgnore([ ignorepattern ]);
  return ignoredPaths( filepath );
}

/**
 *  When typing into 'settings' many 'changes' occur sequentially.
 *  Sometimes one change per character typed. This means, most changes are "incomplete".
 *  This timout is meant to dampen away at least some "incomplete" changes.
 *
 *  @param  {Array<string>} grammar
 */
export function triggerReLint( grammar ) {
  if ( relinttrigger ) {
       clearTimeout( relinttrigger );
       relinttrigger = undefined;
  }
  relinttrigger = setTimeout( relintOnTimer, 2500, grammar );
}

/**
 *  Callback to run by atom, in case projectpaths did change. Required to update relative search
 *  paths for eslint options and 'node_modules' paths.
 *  Registered in 'index.js' <code>activate()</code>
 *
 *  Note:
 *  So far I found no callback like <code>atom.onDidChangeProject</code>; whilst, after selecting a
 *  new project, <code>atom.history.onDidChangeProjects</code> seems to be triggered _after_ 'linter'
 *  has been run on the projects open editors (which renders it useless for adapting eslinter.options
 *  to path changes).
 */
export function onChangeProjectPaths( projectpaths ) {
  console.log( "project paths changed!" );
  atomprojectpaths = cleanPaths( projectpaths );
  atomprojectnodemodulepaths = toModulePaths( atomprojectpaths )
}

/**
 *  This is about 'fast-eslint-8's 'configSchema.baseconfig' (package.json), which is getting
 *  translated into eslint 'options.baseConfig'.
 *  @see [new ESLint( options )](https://eslint.org/docs/developer-guide/nodejs-api#-new-eslintoptions)
 *
 *  Obviously the base configuration has changed. Save the new state and reset the linter engine.
 *  Next time the linter might be invoked, it will create a new linter engine (see function 'exec').
 *
 *  @param  {Array<string>} presets - An array of strings, each string must be the name of a base
 *                                    configuration.
 *
 */
export function updateBaseCfg( presets ) {
  const baseconfig = { };
  if ( presets.extends.length !== 0 ) { baseconfig.extends = [ ...presets.extends ]}

  options.baseConfig = ( Object.getOwnPropertyNames( baseconfig ).length === 0 ) ? null : baseconfig;

  // options have changed, so reset the linter engine.
  engine = undefined;
}

/**
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
 *  Obviously the eslint configuration has changed. Save the new state and reset the linter engine.
 *  Next time the linter might be invoked, it will create a new linter engine (see function 'exec').
 *
 *  @param  {object}        presets
 *  @param  {string|null}   [presets.cwd]                         - See 'options.cwd' of new ESLint( options )
 *  @param  {boolean}       presets.allowInlineConfig             - See 'options.allowInlineConfig' of new ESLint( options )
 *  @param  {string|null}   [presets.overrideConfigFile]          - See 'options.overrideConfigFile' of new ESLint( options )
 *  @param  {boolean}       presets.reportUnusedDisableDirectives - See 'options.allowInlineConfig' of new ESLint( options )
 *  @param  {Array<string>} presets.rulePaths                     - See 'options.rulePaths' of new ESLint( options )
 *  @param  {boolean}       presets.useEslintrc                   - See 'options.useEslintrc' of new ESLint( options )
 *
 */
export function updateEslintCfg( presets ) {
  // position 1: cwd
  if ( presets.cwd ) { options.cwd = presets.cwd }
  else { delete options.cwd }

  // position 2: allowInlineConfig
  options.allowInlineConfig = presets.allowInlineConfig;

  // position 3: overrideConfigFile
  options.overrideConfigFile = buildConfigFilePath( presets.overrideConfigFile );

  // position 4: reportUnusedDisableDirectives
  options.reportUnusedDisableDirectives = presets.reportUnusedDisableDirectives;

  // position 5: rulePaths
  options.rulePaths = buildRulePaths( presets.rulePaths );

  // position 6: useEslintrc
  options.useEslintrc = ( presets.useEslintrc === true ) ? true : false;

  // options have changed, so reset the linter engine.
  engine = undefined;
}
