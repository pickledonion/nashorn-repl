//util.spec.js 22
/* globals describe, it, expect, _, root, util, com */

(function () {
  'use strict';
  var root = this;

  describe ('util.getTypes', function () {


    var ary = [
      ['CharArray','char[]'],
      'java.io.File',
      'java.io.InputStreamReader',
      'java.io.OutputStreamWriter',
      'java.lang.String',
      'java.lang.System',
      'java.lang',
      'lang.Thread',
      'com.sun.jdi',
      'jdi.Bootstrap'
    ];

    // prn(ary);
    // prn(util.getTypes(ary, [root]));
    // var ary = [ ['charArray', 'char[]'], 'java.io.File'];

    it( 'turns chararray into class', function () {
      expect(util.getTypes(ary, [root]).CharArray.class.name).toBe('[C');
    });

    it( 'turns file into class', function () {
      expect(util.getTypes(ary, [root]).File.class.name).toBe('java.io.File');
    });

    it( 'turns com.sun.jdi into package', function () {
      expect(util.getTypes(ary, [root]).jdi + '').toBe('[object JavaPackage]');
    });

    it( 'turns jdi.Bootstrap into class', function () {
      expect(util.getTypes(ary, [root]).Bootstrap.class.name).toBe('com.sun.jdi.Bootstrap');
    });


  });

  describe ('util.stringToJava', function () {
    it( 'turns java.lang.Thread str into java', function () {
      expect(util.stringToJava('java.lang.Thread')).toBe(java.lang.Thread);
    });
    it( 'turns java.lang and lang.Thread str into java', function () {
      util.stringToJava('lang.Thread', {lang:java.lang})
     });

    it( 'turns com.sun.jdi str in package from root', function () {
      util.stringToJava('com.sun.jdi', [root])
    });

    it( 'turns com.sun.jdi str in package from root', function () {
      util.stringToJava('com.sun.jdi', [root])
    });

  });

  describe ('util.kindOf', function() {

    it ('is in a object ns', function () {
      expect(_.isObject(util)).toBe(true);
    });

    it ('is a function', function () {
      expect(_.isFunction(util.kindOf)).toBe(true);
    });

    it ('knows numbers', function () {
      expect(util.kindOf(23)).toBe('number');
    });

    it ('knows strings', function () {
      expect(util.kindOf('foo')).toBe('string');
    });

    it ('knows functions', function () {
      expect(util.kindOf(function () {})).toBe('function');
    });

    it ('knows arrays', function () {
      expect(util.kindOf([])).toBe('array');
    });

    it ('knows js objects', function () {
      expect(util.kindOf({})).toBe('object');
    });

    it ('knows java instances', function () {
      expect(util.kindOf(new java.lang.Thread())).toBe('java');
    });

    it ('knows java classes', function () {
      expect(util.kindOf(java.lang.Thread)).toBe('java');
    });

  });
}).call(this);
