/*
 *  © 2022, db-developer
 *
 *  00.00.imports.and.constants.js  is  distributed  WITHOUT  ANY  WARRANTY;  without
 *  even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 *
 */
"use strict";

/**
 *  Moduletable
 *  @ignore
 */
const _m = {
  conf:   require( "../lib/config" ),
  lint:   require( "../lib/lint"   ).lint
};

// required to adapt to fast-eslint-8, fast-eslint-9, ... fast-eslint-<n>
_m.conf.initContext({ packagename: "fast-eslint-8" });

/**
 *  Run eslint on 'filepath'. Taken from arnaud-dezandee/fast-eslint
 *  @see: https://github.com/arnaud-dezandee/fast-eslint/blob/master/spec/linter-spec.js
 *
 *  @return {object} eslint results
 */
module.exports.openFile = ( filepath ) => (
  atom.workspace.open( filepath )
      .then(( editor ) => _m.lint( editor ))
);

/**
 *  Format an eslinter message. Taken from arnaud-dezandee/fast-eslint
 *  @see: https://github.com/arnaud-dezandee/fast-eslint/blob/master/spec/linter-spec.js
 *
 *  @return {object} eslint results
 */
module.exports.formatMsg = ( ruleId, message ) => (
  `${ ruleId || "fatal" }: ${ message }`
);
