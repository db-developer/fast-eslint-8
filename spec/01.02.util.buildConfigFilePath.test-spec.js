/*
 *  © 2022, db-developer
 *
 *  01.02.util.buildConfigFilePath.test-spec.js  is distributed WITHOUT ANY WARRANTY; without
 *  even  the  implied  warranty of  MERCHANTABILITY  or FITNESS  FOR A  PARTICULAR  PURPOSE.
 */
"use strict";

/**
 *  Moduletable
 *  @ignore
 */
const _m = {
  os:       require( "os"   ),
  path:     require( "path" ),
  util:     require( "../lib/util" )
};

describe( "01.02.util.buildConfigFilePath.test-spec.js - testing module 'util'", () => {
  describe( "Module 'util' ...", () => {
    it( "... should provide function 'buildConfigFilePath'", () => {
        expect( _m.util.buildConfigFilePath ).toBeDefined();
        expect( _m.util.buildConfigFilePath ).not.toBe( null );
        expect( typeof( _m.util.buildConfigFilePath )).toBe( "function" );
    });
  });
  describe( "Testing function 'buildConfigFilePath' of module 'util'", () => {

    it( "... should not fail, if called without any parameter", () => {
        let   result   = undefined;
        expect(() => { result = _m.util.buildConfigFilePath()}).not.toThrow();
        expect( result ).toBeNull();
    });

    it( "... should not fail, if called with missing parameters", () => {
        const filepath = "file/path/.eslintrc.js";
        const prjpath  = "/Temp";
        let   result1  = undefined;
        expect(() => { result1 = _m.util.buildConfigFilePath( undefined, prjpath )}).not.toThrow();
        expect( result1 ).toBeNull();

        let   result2  = undefined;
        expect(() => { result2 = _m.util.buildConfigFilePath( null, prjpath )}).not.toThrow();
        expect( result2 ).toBeNull();

        let   result3  = undefined;
        expect(() => { result3 = _m.util.buildConfigFilePath( filepath, undefined )}).not.toThrow();
        expect( result3 ).toBeNull();

        let   result4  = undefined;
        expect(() => { result4 = _m.util.buildConfigFilePath( filepath, null )}).not.toThrow();
        expect( result4 ).toBeNull();
    });

    it( "... should not fail, if called with parameters (relative)", () => {
        const filepath = "file/path/.eslintrc.js";
        const prjpath  = "/Temp";
        const expected = _m.path.resolve( prjpath, filepath );
        let   result   = undefined;
        expect(() => { result = _m.util.buildConfigFilePath( filepath, prjpath )}).not.toThrow();
        expect( result ).toBe( expected );
    });

    it( "... should not fail, if called with parameters (absolute)", () => {
        const filepath = "/file/path/.eslintrc.js";
        const prjpath  = "/Temp";
        const expected = _m.path.resolve( filepath );
        let   result   = undefined;
        expect(() => { result = _m.util.buildConfigFilePath( filepath, prjpath )}).not.toThrow();
        expect( result ).toBe( expected );
    });

    it( "... should not fail, if called with parameters (userhome)", () => {
        const filepath = "/file/path/.eslintrc.js";
        const prjpath  = "/Temp";
        const expected = _m.path.resolve( _m.os.homedir(), "." + filepath );
        let   result   = undefined;
        expect(() => { result = _m.util.buildConfigFilePath( "~" + filepath, prjpath )}).not.toThrow();
        expect( result ).not.toBe( _m.path.resolve( filepath ));
        expect( result ).not.toBe( _m.path.resolve( prjpath, filepath ));
        expect( result ).toBe( expected );
    });
  });
});
