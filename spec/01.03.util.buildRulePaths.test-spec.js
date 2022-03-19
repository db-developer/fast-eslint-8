/*
 *  © 2022, db-developer
 *
 *  01.03.util.buildRulePaths.test-spec.js is distributed WITHOUT ANY WARRANTY; without
 *  even the implied warranty of MERCHANTABILITY  or FITNESS FOR A PARTICULAR  PURPOSE.
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

describe( "01.03.util.buildRulePaths.test-spec.js - testing module 'util'", () => {
  describe( "Module 'util' ...", () => {
    it( "... should provide function 'buildRulePaths'", () => {
        expect( _m.util.buildRulePaths ).toBeDefined();
        expect( _m.util.buildRulePaths ).not.toBe( null );
        expect( typeof( _m.util.buildRulePaths )).toBe( "function" );
    });
  });
  describe( "Testing function 'buildRulePaths' of module 'util'", () => {
    it( "... should not fail, if called without any parameter", () => {
        let   result   = undefined;
        expect(() => { result = _m.util.buildRulePaths()}).not.toThrow();
        expect( Array.isArray( result )).toBe( true );
        expect( result.length ).toBe( 0 );
    });

    it( "... should not fail, if called with missing parameters", () => {
        const directories  = [ "./foo/bar", "~/eslint/rules", "/eslint/rules" ];
        const projectpaths = [ "/Temp/Projects/p1", "/Temp/Projects/p2" ];
        let   result1      = undefined;
        expect(() => { result1 = _m.util.buildRulePaths( undefined, projectpaths )}).not.toThrow();
        expect( Array.isArray( result1 )).toBe( true );
        expect( result1.length ).toBe( 0 );

        let   result2  = undefined;
        expect(() => { result2 = _m.util.buildRulePaths( null, projectpaths )}).not.toThrow();
        expect( result2 ).not.toBeNull();
        expect( Array.isArray( result2 )).toBe( true );
        expect( result2.length ).toBe( 0 );

        let   result3  = undefined;
        expect(() => { result3 = _m.util.buildRulePaths( directories, undefined )}).not.toThrow();
        expect( result3 ).not.toBeNull();
        expect( Array.isArray( result3 )).toBe( true );
        expect( result3.length ).toBe( 2 );

        let   result4  = undefined;
        expect(() => { result4 = _m.util.buildRulePaths( directories, null )}).not.toThrow();
        expect( result4 ).not.toBeNull();
        expect( Array.isArray( result4 )).toBe( true );
        expect( result4.length ).toBe( 2 );
    });

    it( "... should not fail, if called with parameters (relative)", () => {
        const directories  = [ "./foo/bar", "~/eslint/rules", "/eslint/rules" ];
        const projectpaths = [ "/Temp/Projects/p1", "/Temp/Projects/p2" ];
        let   result   = undefined;
        expect(() => { result = _m.util.buildRulePaths( directories, projectpaths )}).not.toThrow();
        expect( result ).not.toBeNull();
        expect( Array.isArray( result )).toBe( true );
        expect( result.length ).toBe( 4 );
        expect( result.includes( _m.path.resolve( projectpaths[0], directories[0])));
        expect( result.includes( _m.path.resolve( projectpaths[1], directories[0])));
        expect( result.includes( _m.path.resolve( _m.os.homedir(), directories[1].replace( "~", "." ))));
        expect( result.includes( directories[2]));
    });
  });
});
