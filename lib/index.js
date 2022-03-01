'use babel';

import { CompositeDisposable,
         Emitter              } from "atom";
import { exec,
         handle,
         isIgnored,
         triggerReLint,
         onChangeProjectPaths,
         updateBaseCfg,
         updateEslintCfg      } from "./exec";
const    helpers                = require( "atom-linter" );
const    pkgdeps                = require( "atom-package-deps" );

/**
 *  Initialize stringtable.
 *  @ignore
 */
function _init_STRINGS() {
  const pkgname = "fast-eslint-8";

  return {
    BASECONFIG:     pkgname + ".baseconfig",
    ESLINT:         "ESLint",
    ESLINTCONFIG:   pkgname + ".eslintopts",
    ESLINTIGNORE:   ".eslintignore",
    FILE:           "file",
    GRAMMARSCOPES:  pkgname + ".grammarScopes",
    PKGNAME:        pkgname,
    SHOULDLINT:     "should-lint"
  };
}

/**
 *  Stringtable
 *  @ignore
 */
const _STRINGS = _init_STRINGS();

module.exports = {
  activate() {
    pkgdeps.install( _STRINGS.PKGNAME );

    let emitter       = new Emitter();

    this.subscriptions = new CompositeDisposable();
    this.subscriptions.add(
      emitter,
      atom.project.onDidChangePaths( onChangeProjectPaths ),
      atom.config.observe( _STRINGS.GRAMMARSCOPES, ( grammar ) => {
        this.grammarScopes = grammar;
        emitter.emit( _STRINGS.SHOULDLINT, this.grammarScopes );
      }),
      atom.config.observe( _STRINGS.BASECONFIG,    ( presets ) => {
        updateBaseCfg( presets );
        emitter.emit( _STRINGS.SHOULDLINT, this.grammarScopes );
      }),
      atom.config.observe( _STRINGS.ESLINTCONFIG,  ( presets ) => {
        updateEslintCfg( presets );
        emitter.emit( _STRINGS.SHOULDLINT, this.grammarScopes );
      })
    );

    emitter.on( _STRINGS.SHOULDLINT, triggerReLint );
  },

  deactivate() {
    this.subscriptions.dispose();
  },

  provideLinter() {
    return {
      grammarScopes:  this.grammarScopes,
      scope:          _STRINGS.FILE,
      name:           _STRINGS.ESLINT,
      lintsOnChange:  true,
      lint:           ( texteditor ) => {
        const filePath   = texteditor.getPath();
        const fileText   = texteditor.getText();
        const ignoreFile = helpers.find( filePath, _STRINGS.ESLINTIGNORE );

        if ( ignoreFile && isIgnored( ignoreFile, filePath )) {
             return new Promise(( resolve ) => resolve([]));
        }
        else return exec( filePath, fileText ).then(( report ) => { return handle( texteditor, report )});
      }
    };
  },
};
