/**
 *	index.js: fast-eslint-8
 *
 *  @module fast-eslint-8
 *
 *//*
 *  © 2022, slashlib.org.
 *
 *  index.js  is distributed WITHOUT ANY WARRANTY; without even the implied
 *  warranty of  MERCHANTABILITY  or  FITNESS  FOR  A  PARTICULAR  PURPOSE.
 *
 */
"use strict";

/**
 *  Module table
 *  @ignore
 */
const _m = Object.seal( Object.freeze({
  atom:           require( "atom" ),
  pkgdeps:        require( "atom-package-deps" ),
  config:         require( "./config" ),
  lint:           require( "./lint"   )
}));

/**
 *  Stringtable
 *  @ignore
 */
const _STRINGS = Object.seal( Object.freeze({
  ACTIVATE:       "activate",
  DEACTIVATE:     "deactivate",
  ESLINT:         "ESLint",
  FILE:           "file",
  PKGNAME:        "fast-eslint-8",
  PROVIDELINTER:  "provideLinter"
}));

/**
 *  Configuration
 *  @ignore
 */
const _CONFIG = {
  grammmarscopes: [],
  packagename:     _STRINGS.PKGNAME
}

let subscriptions = undefined;

/**
 *  'fast-eslint-8' package interface 'activate'
 */
function activate() {
  // install package dependencies of 'fast-eslint-8'
  _m.pkgdeps.install( _STRINGS.PKGNAME );

  const emitter = new _m.atom.Emitter();

  subscriptions = new _m.atom.CompositeDisposable();
  subscriptions.add( emitter );

  // setup eslinter configuration on activate
  _m.config.onActivate( atom, _CONFIG, emitter, subscriptions );
}

/**
 *  'fast-eslint-8' package interface 'deactivate'
 */
function deactivate() {
  subscriptions.dispose();
}

/**
 *  'fast-eslint-8' linter provider interface.
 */
function provideLinter() {
  return {
    get grammarScopes() { return  _CONFIG.grammmarscopes },
    scope:          _STRINGS.FILE,
    name:           _STRINGS.ESLINT,
    lintsOnChange:  true,
    lint:           _m.lint.lint
  };
}

// Module exports:
Object.defineProperty( module.exports, _STRINGS.ACTIVATE,   {
  value:    activate,
  writable: false, enumerable: true, configurable: false });
Object.defineProperty( module.exports, _STRINGS.DEACTIVATE, {
  value:    deactivate,
  writable: false, enumerable: true, configurable: false });
Object.defineProperty( module.exports, _STRINGS.PROVIDELINTER, {
  value:    provideLinter,
  writable: false, enumerable: true, configurable: false });
