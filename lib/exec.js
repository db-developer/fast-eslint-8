/**
 *	exec.js: fast-eslint-8
 *
 *  @module fast-eslint-8/exec
 *
 *//*
 *  © 2022, slashlib.org.
 *
 *  exec.js  is distributed WITHOUT ANY WARRANTY; without even the implied
 *  warranty of  MERCHANTABILITY  or  FITNESS  FOR A  PARTICULAR  PURPOSE.
 *
 */
"use strict";

/**
 *  Module table
 *  @ignore
 */
const _m = Object.seal( Object.freeze({
  atom:             require( "atom"        ),
  atomlinter:       require( "atom-linter" ),
  eslint:           require( "eslint"      ),
  loophole:         require( "loophole"    ),
  config:           require( "./config"    )
}));

/**
 *  Stringtable
 *  @ignore
 */
const _STRINGS = Object.seal( Object.freeze({
  ERROR:            "error",
  EXEC:             "exec",
  FATAL:            "fatal",
  HANDLE:           "handle",
  WARNING:          "warning"
}));

/**
 *  Class Range
 *  @ignore
 */
const Range = _m.atom.Range;

/**
 *  Class Eslint
 *  @ignore
 */
const ESLint = _m.eslint.ESLint;

/**
 *  loophole encapsulation
 */
const allowUnsafeNewFunction = _m.loophole.allowUnsafeNewFunction

/**
 *  @type {ESLint}
 */
let engine = undefined;

/**
 *  Initialize a linter run on a single file.
 *
 *  @see    [ESLint.lintText](https://eslint.org/docs/developer-guide/nodejs-api#-eslintlinttextcode-options)
 *
 *  @param  {string}  filepath  - file path that is passed to eslint.linttext as part of the options parameter.
 *  @param  {string}  filetext  - Code provided by 'filePath'
 *
 *  @return {Promise} which resolves with eslinter results, or is rejected with an error.
 */
function exec( filepath, filetext ) {
  return _m.config.getOptions( atom, filepath, engine )
  .then(( options ) => {
    return new Promise(( resolve, reject ) => {
      if ( options ) {
           allowUnsafeNewFunction(() => {
             try {
               // console.log( `setting up new engine for '${ filepath }' with options:`, options );
               engine = new ESLint( options );
               resolve( engine );
             }
             catch( error ) { reject( error )}
           });
      }
      else resolve( engine );
    });
  })
  .then(( engine  ) => {
    return new Promise(( resolve, reject ) => {
      allowUnsafeNewFunction(() => {
        engine.lintText( filetext, { filePath: filepath })
              .then(( result ) => { resolve({ results: result })},
                    ( error  ) => { reject( error )});
      });
    });
  })
  .catch(( error ) => {
    console.log( "*** error ***", error )
    // Rather than displaying a big error, treat the error as a normal lint error so it shows
    // in the footer rather than a pop-up toast error message.
    return Promise.resolve({ results: [{ messages: [{ line: 1, message: error, ruleId: NaN, severity: 2 }]}]});
  });
}

/**
 *  Handle the report returned by a linter-run on some file.
 */
function handle( texteditor, report ) {
  if ( !report || !report.results || !report.results.length ) { return [ ]}

  return report.results[ 0 ].messages.map(({ column = 1, line, message, ruleId, severity, fix }) => {
    const fileBuffer = texteditor.getBuffer();
    const lineLength = texteditor.getBuffer().lineLengthForRow( line - 1 );
    const colStart   = ( column - 1 > lineLength ) ? ( lineLength + 1 ) : column;
    const position   = _m.atomlinter.generateRange( texteditor, line - 1, colStart - 1 );
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

// Module exports:
Object.defineProperty( module.exports, _STRINGS.EXEC,     {
  value:    exec,
  writable: false, enumerable: true, configurable: false });
Object.defineProperty( module.exports, _STRINGS.HANDLE,   {
  value:    handle,
  writable: false, enumerable: true, configurable: false });
