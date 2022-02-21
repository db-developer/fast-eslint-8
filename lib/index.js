'use babel';

import { CompositeDisposable,
         Range                } from "atom";
import { exec,
         handle,
         isIgnored,
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
    BASECONFIG:     pkgname + ".baseConfigExtends",
    ESLINT:         "ESLint",
    ESLINTCONFIG:   pkgname + ".eslintrc",
    ESLINTIGNORE:   ".eslintignore",
    FILE:           "file",
    GRAMMARSCOPES:  pkgname + ".grammarScopes",
    PKGNAME:        pkgname
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

    this.subscriptions = new CompositeDisposable();
    this.subscriptions.add( atom.config.observe( _STRINGS.GRAMMARSCOPES, ( grammar ) => {
      this.grammarScopes = grammar;
    }));
    this.subscriptions.add( atom.config.observe( _STRINGS.BASECONFIG,    ( presets ) => {
      updateBaseCfg( presets, this.grammarScopes );
    }));
    this.subscriptions.add( atom.config.observe( _STRINGS.ESLINTCONFIG,  ( presets ) => {
      updateEslintCfg( presets, this.grammarScopes );
    }));
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
        const fileBuffer = texteditor.getBuffer();
        const ignoreFile = helpers.find( filePath, _STRINGS.ESLINTIGNORE );

        if ( ignoreFile && isIgnored( ignoreFile, filePath )) {
             return new Promise(( resolve ) => resolve([]));
        }
        else return exec( filePath, fileText ).then(( report ) => { return handle( texteditor, report )});
      }
    };
  },
};
