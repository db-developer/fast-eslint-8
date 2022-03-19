/*
 *  © 2022, db-developer
 *
 *  10.01.eslint.recommended.test-spec.js  is distributed WITHOUT ANY WARRANTY; without
 *  even the implied warranty of MERCHANTABILITY  or FITNESS FOR A PARTICULAR  PURPOSE.
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

describe( "10.01.eslint.recommended.test-spec.js - fast-eslint-8 provider extends: 'eslint:recommended'", () => {
  beforeEach(() => waitsForPromise(() => atom.packages.activatePackage( "fast-eslint-8" )));

  describe( "find errors in eslint.recommended/fail.js", () => {
    const src       = _m.path.join( __dirname, "fixtures/eslint.recommended/fail.js" );
    const expected  = [{
        excerpt:    "no-undef: 'bar' is not defined.",
        location: {
          file:     src,
          position: [[ 2, 10 ],[ 2, 13 ]]
        },
        severity:   "error",
        solutions:  null
      }, {
        excerpt: "no-undef: 'a' is not defined.",
        location: {
          file:     src,
          position: [[ 10, 0 ],[ 10 , 1 ]]
        },
        severity:   "error",
        solutions:  null
      }
    ];
    let   presults  = _m.open( src );
    let   rcount    = 2;

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
          it( `eslint - checking result.severity ${ idx + 1 } of ${ rcount }`, ( done ) => {
              return presults.then(( results ) => {
                expect( results[ idx ].severity === expected[ idx ].severity ).toBe( true );
              });
          });
          it( `eslint - checking result.solutions ${ idx + 1 } of ${ rcount }`, ( done ) => {
              return presults.then(( results ) => {
                expect( results[ idx ].solutions === expected[ idx ].solutions ).toBe( true );
              });
          });
    }
  });
});
