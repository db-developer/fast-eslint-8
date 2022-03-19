/*
 *  © 2022, db-developer
 *
 *  10.00.eslint.ignore.test-spec.js  is distributed WITHOUT ANY WARRANTY; without even
 *  the  implied  warranty of  MERCHANTABILITY  or FITNESS  FOR A  PARTICULAR  PURPOSE.
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
};


describe( "10.00.eslint.ignore.test-spec.js - fast-eslint-8 provider testing .eslintignore", () => {
  beforeEach(() => waitsForPromise(() => atom.packages.activatePackage( "fast-eslint-8" )));

  describe( "find no errors in ignored file ignore/source.js", () => {
    const src      = _m.path.join( __dirname, "fixtures/ignore/source.js" );
    let   presults = _m.open( src );
    let   rcount   = 0;

    it( "File should not be linted", () => {
        return presults.then(( results ) => {
          expect( results.length ).toEqual( rcount );
        });
    });
  });
});
