/*
 * Copyright (c) 2013, Oracle and/or its affiliates.
 * All rights reserved. Use is subject to license terms.
 *
 * This file is available and licensed under the following license:
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 *
 *  - Redistributions of source code must retain the above copyright
 *    notice, this list of conditions and the following disclaimer.
 *  - Redistributions in binary form must reproduce the above copyright
 *    notice, this list of conditions and the following disclaimer in
 *    the documentation and/or other materials provided with the distribution.
 *  - Neither the name of Oracle Corporation nor the names of its
 *    contributors may be used to endorse or promote products derived
 *    from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

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

//     it( 'turns com.sun.jdi into package', function () {
//       expect(util.getTypes(ary, [root]).jdi + '').toBe('[object JavaPackage]');
//     });

//    it( 'turns jdi.Bootstrap into class', function () {
//      expect(util.getTypes(ary, [root]).Bootstrap.class.name).toBe('com.sun.jdi.Bootstrap');
//    });


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
