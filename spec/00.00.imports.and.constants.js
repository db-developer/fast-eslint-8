/*
 *  © 2022, db-developer
 *
 *  00.00.imports.and.constants.js  is  distributed  WITHOUT  ANY  WARRANTY;  without
 *  even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 *
 */

/**
 *  Moduletable
 *  @ignore
 */
const _m = {
  lint:   require( "../lib/index.js" ).provideLinter().lint
};

/**
 *  Run eslint on 'filepath'. Taken from arnaud-dezandee/fast-eslint
 *  @see: https://github.com/arnaud-dezandee/fast-eslint/blob/master/spec/linter-spec.js
 *
 *  @return {object} eslint results
 */
module.exports.openFile = ( filepath ) => (
  atom.workspace
      .open( filepath )
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
