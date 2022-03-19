/*
 *  © 2022, db-developer
 *
 *  10.02.airbnb-base.test-spec.js  is distributed  WITHOUT ANY WARRANTY; without even
 *  the implied  warranty of  MERCHANTABILITY  or FITNESS  FOR A  PARTICULAR  PURPOSE.
 *
 *  Tests from [fast-eslint](https://github.com/arnaud-dezandee/fast-eslint/blob/master/spec/linter-spec.js)
 */
"use babel";

/**
 *  Moduletable
 *  @ignore
 */
const _m = {
  path:     require( "path" ),
  open:     require( "./00.00.imports.and.constants" ).openFile,
  format:   require( "./00.00.imports.and.constants" ).formatMsg
};


describe( "10.01.airbnb-base.test-spec.js - fast-eslint-8 provider extends: 'airbnb-base'", () => {
  beforeEach(() => waitsForPromise(() => atom.packages.activatePackage( "fast-eslint-8" )));

  describe( "find errors in airbnb/bad.js", () => {
    const src = _m.path.join( __dirname, "fixtures/airbnb/fail.js" );
    const expected  = [{
        excerpt:    "no-var: Unexpected var, use let or const instead.",
        location: {
          file:     src,
          position: [[ 0, 0 ],[ 0, 3 ]]
        },
        severity:   "error"
      }, {
        excerpt:    "keyword-spacing: Expected space(s) after \"if\".",
        location: {
          file:     src,
          position: [[ 2, 0 ],[ 2 , 2 ]]
        },
        severity:   "error"
      }, {
        excerpt:    "eqeqeq: Expected '===' and instead saw '=='.",
        location: {
          file:     src,
          position: [[ 2, 7 ],[ 2 , 13 ]]
        },
        severity:   "error"
      }, {
        excerpt:    "no-undef: 'bar' is not defined.",
        location: {
          file:     src,
          position: [[ 2, 10 ],[ 2 , 13 ]]
        },
        severity:   "error"
      }, {
        excerpt:    "semi: Missing semicolon.",
        location: {
          file:     src,
          position: [[ 2, 25 ],[ 2 , 25 ]]
        },
        severity:   "error"
      }, {
        excerpt:    "no-multiple-empty-lines: More than 1 blank line not allowed.",
        location: {
          file:     src,
          position: [[ 8, 0 ],[ 8 , 0 ]]
        },
        severity:   "error"
      }, {
        excerpt:    "no-unused-expressions: Expected an assignment or function call and instead saw an expression.",
        location: {
          file:     src,
          position: [[ 10, 0 ],[ 10 , 1 ]]
        },
        severity:   "error"
      }, {
        excerpt:    "no-undef: 'a' is not defined.",
        location: {
          file:     src,
          position: [[ 10, 0 ],[ 10 , 1 ]]
        },
        severity:   "error"
      }, {
        excerpt:    "semi: Missing semicolon.",
        location: {
          file:     src,
          position: [[ 10, 1 ],[ 10 , 1 ]]
        },
        severity:   "error"
      }
    ];
    let   presults  = _m.open( src );
    let   rcount    = 9;

    it( `eslint - results expected: ${ rcount }`, () => {
        return presults.then(( results ) => {
          expect( results.length ).toEqual( rcount );
        });
    });

    for ( let idx = 0; idx < rcount; ++ idx ) {
          it( `eslint - checking result.excerpt ${ idx + 1 } of ${ rcount }`, () => {
              return presults.then(( results ) => {
                expect( results[ idx ].excerpt === expected[ idx ].excerpt ).toBe( true );
              });
          });
          it( `eslint - checking result.location ${ idx + 1 } of ${ rcount }`, () => {
              return presults.then(( results ) => {
                expect( results[ idx ].location.file === expected[ idx ].location.file ).toBe( true );
                expect( results[ idx ].location.position[0][0] === expected[ idx ].location.position[0][0]).toBe( true );
                expect( results[ idx ].location.position[0][1] === expected[ idx ].location.position[0][1]).toBe( true );
                expect( results[ idx ].location.position[1][0] === expected[ idx ].location.position[1][0]).toBe( true );
                expect( results[ idx ].location.position[1][1] === expected[ idx ].location.position[1][1]).toBe( true );
              });
          });
          it( `eslint - checking result.severity ${ idx + 1 } of ${ rcount }`, () => {
              return presults.then(( results ) => {
                expect( results[ idx ].severity === expected[ idx ].severity ).toBe( true );
              });
          });
    }
  });
});
