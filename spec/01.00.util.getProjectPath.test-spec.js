/*
 *  © 2022, db-developer
 *
 *  01.00.util.getProjectPath.test-spec.js is distributed WITHOUT ANY WARRANTY; without
 *  even the implied warranty of MERCHANTABILITY  or FITNESS FOR A PARTICULAR  PURPOSE.
 */
"use strict";

/**
 *  Moduletable
 *  @ignore
 */
const _m = {
  util:     require( "../lib/util" )
};

describe( "01.00.util.getProjectPath.test-spec.js - testing module 'util'", () => {
  describe( "Module 'util' ...", () => {
    it( "... should provide function 'getProjectPath'", () => {
        expect( _m.util.getProjectPath ).toBeDefined();
        expect( _m.util.getProjectPath ).not.toBe( null );
        expect( typeof( _m.util.getProjectPath )).toBe( "function" );
    });
  });
  describe( "Testing function 'getProjectPath' of module 'util'", () => {
    const path1       = "C:\\Temp\\projectroot";
    const path2       = "C:\\Temp\\projectroot\\subproject";
    const path3       = "C:\\Sibling\\projectroot";
    const directories = [{ path: path1 },{ path: path2 },{ path: path3 }];

    it( "... should not fail, if called without any parameter", () => {
        expect(() => { _m.util.getProjectPath()}).not.toThrow();
    });

    it( "... should not fail, if called with 'directories' and 'filepath' {'C:\\Temp\\projectroot\\subproject\\lib\\fun.js'}", () => {
        const expected = path2;
        const filepath = "C:\\Temp\\projectroot\\subproject\\lib\\fun.js";
        let   result   = undefined;
        expect(() => { result = _m.util.getProjectPath( filepath, directories )}).not.toThrow();
        expect( result ).toBe( expected );
    });

    it( "... should not fail, if called with 'directories' and 'filepath' {'C:\\Sibling\\projectroot\\lib\\foo.js'}", () => {
        const expected = path3;
        const filepath = "C:\\Sibling\\projectroot\\lib\\foo.js";
        let   result   = undefined;
        expect(() => { result = _m.util.getProjectPath( filepath, directories )}).not.toThrow();
        expect( result ).toBe( expected );
    });

    it( "... should not fail, if called with 'directories' and 'filepath' {'C:\\Other\\projectroot\\lib\\bar.js'}", () => {
        const expected = "C:\\Other\\projectroot\\lib";
        const filepath = expected + "\\bar.js";
        let   result   = undefined;
        expect(() => { result = _m.util.getProjectPath( filepath, directories )}).not.toThrow();
        expect( result ).toBe( expected );
    });

    it( "... should not fail, if called with 'directories' '[]:length:1' and 'filepath' {'C:\\Temp\\projectroot\\subproject\\lib\\baz.js'}", () => {
        const expected    = "C:\\Gnarf\\projectroot";
        const filepath    = "C:\\Temp\\projectroot\\subproject\\lib\\baz.js";
        const directories = [{ path: expected }];
        let   result      = undefined;
        expect(() => { result = _m.util.getProjectPath( filepath, directories )}).not.toThrow();
        expect( result ).toBe( expected );
    });

  });
});
