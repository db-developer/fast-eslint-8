/**
 *	lint.js: fast-eslint-8
 *  Watch and handle atoms/fast-eslint-8's configuration settings.
 *
 *  @module fast-eslint-8/config
 *
 *//*
 *  © 2022, slashlib.org.
 *
 *  lint.js  is distributed WITHOUT ANY WARRANTY; without even the implied
 *  warranty of  MERCHANTABILITY  or  FITNESS  FOR A  PARTICULAR  PURPOSE.
 *
 */
"use strict";

/**
 *  Module table
 *  @ignore
 */
const _m = Object.seal( Object.freeze({
  atomlinter:     require( "atom-linter"      ),
  eslintrc:       require( "@eslint/eslintrc" ),
  fs:             require( "fs"     ),
  path:           require( "path"   ),
  exec:           require( "./exec" )
}));

/**
 *  Class IgnorePattern
 *  @ignore
 */
const IgnorePattern = _m.eslintrc.Legacy.IgnorePattern;

/**
 *  Stringtable
 *  @ignore
 */
const _STRINGS = Object.seal( Object.freeze({
  EMPTY:          "",
  ESLINTIGNORE:   ".eslintignore",
  HASH:           "#",
  LINT:           "lint",
  TRIGGERRELINT:  "triggerReLint",
  UTF8:           "utf8"
}));

/**
 *  Check atom for open editors and initialize a new linter run for each editor.
 *  This method is usually called
 *    - after eslinter configuration changes
 *
 *  @param  {Array<string>} grammar
 */
function reLintOnTimer( grammar ) {
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
    return atom.commands.dispatch( view, "linter:lint" );
  });
}

/**
 *  timer handle - see function 'triggerReLint'
 *  @ignore
 */
let relinttrigger = undefined;

/**
 *  When typing into 'settings' many 'changes' occur sequentially.
 *  Sometimes one change per character typed. This means, most changes are "incomplete".
 *  This timout is meant to dampen away at least some "incomplete" changes.
 *
 *  @param  {Array<string>} grammar
 */
function triggerReLint( grammar ) {
  if ( relinttrigger ) {
       clearTimeout( relinttrigger );
       relinttrigger = undefined;
  }
  relinttrigger = setTimeout( reLintOnTimer, 2500, grammar );
}

/**
 *  Read patterns from 'ignorefile' (.eslintignore) and return true,
 *  if ignored paths contain 'filepath'.
 *
 *  @param  {string}  ignorefile  - Filepath of .eslintignore
 *  @param  {string}  filepath    - Filepath to check whether to ignore or not.
 *
 *  @return {boolean} true, if 'filepath' should be ignored; false otherwise.
 */
function isIgnored( ignorefile, filepath ) {
  const patterns = _m.fs.readFileSync( ignorefile, _STRINGS.UTF8 )
    .replace( /^\ufeff/u, _STRINGS.EMPTY )
    .split( /\r?\n/gu )
    .filter(( line ) => line.trim() !== _STRINGS.EMPTY && !line.startsWith( _STRINGS.HASH ));
  const  ignorepattern = new IgnorePattern( patterns, _m.path.dirname( ignorefile ));
  const  ignoredPaths  = IgnorePattern.createIgnore([ ignorepattern ]);
  return ignoredPaths( filepath );
}

/**
 *  Linter interface function.
 *  @see [atom standard linter](http://steelbrain.me/linter/examples/standard-linter-v2.html)
 *
 *  @param  {TextEditor} texteditor
 *
 *  @return {Promise<Array<Message>>|null} - returning null will reuse results of previous
 *          linter runs.
 */
function lint( texteditor ) {
  // Restrict linting to texteditors which are part of the current workspace
  // Note: linter seems to get triggered for texteditors that are invisible.
  //       this happens when switching projects and leads to linting editor
  //       content with .eslintrc.* of other/wrong project paths.
  //    => texteditor.component.visible === false for such texteditors.
  //    => atom.workspace.getTextEditors().includes( texteditor ) === false
  //       for such editors.
  if ( atom.workspace.getTextEditors().includes( texteditor )) {
       const filepath   = texteditor.getPath();
       const fileText   = texteditor.getText();
       const ignoreFile = _m.atomlinter.find( filepath, _STRINGS.ESLINTIGNORE );

       if ( ! ( ignoreFile && isIgnored( ignoreFile, filepath ))) {
            return _m.exec.exec( filepath, fileText ).then(( report ) => {
              return _m.exec.handle( texteditor, report );
            });
       }
       else return new Promise(( resolve ) => resolve([]));
  }
  else return null; // null means reusing results of previous linter runs
}

// Module exports:
Object.defineProperty( module.exports, _STRINGS.LINT,          {
  value:    lint,
  writable: false, enumerable: true, configurable: false });
Object.defineProperty( module.exports, _STRINGS.TRIGGERRELINT, {
  value:    triggerReLint,
  writable: false, enumerable: true, configurable: false });
