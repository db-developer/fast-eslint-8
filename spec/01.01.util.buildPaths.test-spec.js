/*
 *  © 2022, db-developer
 *
 *  01.01.util.buildPaths.test-spec.js  is distributed WITHOUT ANY WARRANTY;  without
 *  even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
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

describe( "01.02.util.buildPaths.test-spec.js - testing module 'util'", () => {
  describe( "Module 'util' ...", () => {
    it( "... should provide function 'buildPaths'", () => {
        expect( _m.util.buildPaths ).toBeDefined();
        expect( _m.util.buildPaths ).not.toBe( null );
        expect( typeof( _m.util.buildPaths )).toBe( "function" );
    });
  });
  describe( "Testing function 'buildConfigFilePath' of module 'util'", () => {
    it( "... should not fail, if called without any parameter", () => {
        let   result   = undefined;
        expect(() => { result = _m.util.buildPaths()}).not.toThrow();
        expect( Array.isArray( result )).toBe( true );
        expect( result.length ).toBe( 0 );
    });
  });
});
