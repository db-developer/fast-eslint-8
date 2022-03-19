/*
 *  © 2022, db-developer
 *
 *  02.00.config.initContext.test-spec.js  is distributed WITHOUT ANY WARRANTY; without
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
  config:   require( "../lib/config" )
};

describe( "02.00.config.initContext.test-spec.js - testing module 'config'", () => {
  describe( "Module 'config' ...", () => {
    it( "... should provide function 'initContext'", () => {
        expect( _m.config.initContext ).toBeDefined();
        expect( _m.config.initContext ).not.toBe( null );
        expect( typeof( _m.config.initContext )).toBe( "function" );
    });
  });
  describe( "Testing function 'initContext' of module 'util'", () => {
    it( "... should fail, if called without any parameter", () => {
        expect(() => { _m.config.initContext()}).toThrow();
    });
    it( "... should fail, if called with parameter 'config' {missing property packagename}", () => {
        expect(() => { _m.config.initContext({ })}).toThrow();
    });
    it( "... should not fail, if called with parameter 'config' {config:packagename}", () => {
        expect(() => { _m.config.initContext({ packagename: "fun" })}).not.toThrow();
    });
  });
});
