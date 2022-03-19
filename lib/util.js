/**
 *	util.js: fast-eslint-8
 *
 *  @module fast-eslint-8/util
 *
 *//*
 *  © 2022, slashlib.org.
 *
 *  util.js  is distributed WITHOUT ANY WARRANTY; without even the implied
 *  warranty of  MERCHANTABILITY  or  FITNESS  FOR A  PARTICULAR  PURPOSE.
 *
 */
"use strict";

/**
 *  Module table
 *  @ignore
 */
const _m = Object.seal( Object.freeze({
  childProcess:         require( "child_process" ),
  os:                   require( "os"     ),
  path:                 require( "path"   )
}));

/**
 *  Stringtable
 *  @ignore
 */
const _STRINGS = {
  BUILDCONFIGFILEPATH:  "buildConfigFilePath",
  BUILDPATHS:           "buildPaths",
  BUILDRULEPATHS:       "buildRulePaths",
  CMD_NPM:              "npm root -g",
  DOT:                  ".",
  EMPTY:                "",
  GETPROJECTPATH:       "getProjectPath",
  NODELIBPATH:          "nodelibpath",
  SLASH:                "/",
  TILDE:                "~"
};

/**
 *  Detect global node_modules directory from node/npm installation.
 *  @ignore
 */
let nodelibpath = undefined;
_m.childProcess.exec( _STRINGS.CMD_NPM, ( error, stdout ) => {
  if ( error ) { return; }
  else nodelibpath = _m.path.normalize( stdout.split( _m.os.EOF )[0]);
});

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
function buildPaths( directory, projectpaths, patharray = []) {
  if ( ! directory ) { return patharray }
  else if ( ! _m.path.isAbsolute( directory )) {
       if ( ! directory.startsWith( _STRINGS.TILDE )) {
            projectpaths = projectpaths ? projectpaths : [ ];
            const dirs = projectpaths.map(( projectdir ) => { return _m.path.resolve( projectdir, directory )});
            if ( dirs.length > 0 ) { patharray.push( ...dirs )}
       }
       else patharray.push( _m.path.resolve( _m.os.homedir(), directory.replace( _STRINGS.TILDE, _STRINGS.DOT )));
  }
  else patharray.push( _m.path.resolve( directory ));
  return patharray;
}

/**
 *  Build an array of paths to locate linter rules.
 *  See <code>function buildPaths( directory )</code> for path building details.
 *  See https://eslint.org/docs/developer-guide/working-with-rules
 *
 *  @param  {Array<string>} directories - Directory paths from configuration.
 *  @return {Array<string>} absolute directory paths from configuration.
 */
function buildRulePaths( directories, projectpaths ) {
  const rulepaths = [];
  directories  = directories  ? directories  : [ ];
  projectpaths = projectpaths ? projectpaths : [ ];
  directories.forEach(( directory ) => {
    buildPaths( directory, projectpaths, rulepaths );
  });
  return rulepaths;
}

/**
 *  Builds an absolute filepath to an .eslintrc.* configuration file.
 *  See <code>function buildPaths( directory )</code> for path building details.
 *
 *  @param  {string}  filepath    - An absolute, relative or homedirectory path AND filename of
 *                                  an .eslintrc.* configuration file.
 *  @param  {string}  projectpath - Path of the current project.
 *
 *  @return {string|null} an absolute path to an .eslintrc.* configuration file.
 */
function buildConfigFilePath( filepath, projectpath ) {
  if ( filepath && projectpath ) {
       const paths = buildPaths( filepath, [ projectpath ]);
       return ( paths.length > 0 ) ? paths[ 0 ] : null;
  }
  else return null;
}

/**
 *  Select a project directory. If directory holds one entry, it will be returned.
 *  If directory holds more than one directory, the directory with the shortest
 *  path will be returned (hoping it will be the "root" directory).
 *
 *  Note: 'directories' can contain siblings AND/OR child paths!
 *
 *  @param  {string}            filepath    - The path and name of the file to be linted
 *  @param  {Array<Directory>}  directories - An array of project root directories
 */
function getProjectPath( filepath = _STRINGS.SLASH, directories = []) {
  if ( directories.length !== 1 ) {
       directories = directories.filter(( directory ) => {
         return filepath.startsWith( directory.path );
       });

       const path = directories.reduce(( accumulator, directory ) => {
         return ( accumulator.length > directory.path.length ) ? accumulator : directory.path;
       }, _STRINGS.EMPTY );

       return ( path === _STRINGS.EMPTY ) ? _m.path.dirname( filepath ) : path;
  }
  else return directories[ 0 ].path;
}

// Module exports:
Object.defineProperty( module.exports, _STRINGS.BUILDCONFIGFILEPATH,  {
  value:    buildConfigFilePath,
  writable: false, enumerable: true, configurable: false });
Object.defineProperty( module.exports, _STRINGS.BUILDPATHS,     {
  value:    buildPaths,
  writable: false, enumerable: true, configurable: false });
Object.defineProperty( module.exports, _STRINGS.BUILDRULEPATHS, {
  value:    buildRulePaths,
  writable: false, enumerable: true, configurable: false });
Object.defineProperty( module.exports, _STRINGS.GETPROJECTPATH, {
  value:    getProjectPath,
  writable: false, enumerable: true, configurable: false });
Object.defineProperty( module.exports, _STRINGS.NODELIBPATH,    {
  get() { return nodelibpath },
  enumerable: true, configurable: false });
