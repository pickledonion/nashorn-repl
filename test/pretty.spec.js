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

// pretty.spec.js 1
/* globals describe, it, expect, _,  util */

var root = this;

describe ("pretty", function () {

  'use strict';

  var pp = _.fix(pretty.format, _, {colors:false});

  it ("is an object", function () {
    expect(_.isObject(root.pretty)).toBe(true);
  });

  it ("can pp an array of numbers", function () {
    expect(pp([1,2,3])).toBe('[ 1, 2, 3 ]');
  });

  it ("can pp a function", function () {
    expect(pp(function () {})).toBe('function () {}');
  });

  it ("can pp a function with args", function () {
    expect(pp(function (a) {})).toBe('function (a) {}');
  });

  it ("can walk a function", function () {
    var f = function () {};
    expect( util.mapWalk(_.identity, f)).toBe(f);
  });

  it ("can pp a list of a function", function () {
    var f = function () {};
    expect(pp([f])).toBe('[ [Function] ]');
  });

  it ("can pp a java class", function () {
    var c = javafx.scene.control.Button;
    expect(pp(c)).toBe('\'J:[JavaClass javafx.scene.control.Button]\'');
  });

  it ("can pp a list of a java class", function () {
    var c = javafx.scene.control.Button;
    expect(pp([c])).toBe('[ \'J:[JavaClass javafx.scene.control.Button]\' ]');
  });

  it ("can pp an obj of java instance", function () {
    var b = new javafx.scene.control.Button;
    var o = { Button: b };
    expect(util.kindOf(pp(o))).toBe('string');
  });

  it ("can pp an circular array of numbers", function () {
    var a = [1,2,3];
    a[3] = a;
    expect(pp(a)).toBe('[ 1, 2, 3, \'[Circular]\' ]');
  });

  it ('can pp javafx.application.Platform.runLater', function () {
    var a = javafx.application.Platform.runLater;
    expect(pp(a)).toBe('\'J:[jdk.internal.dynalink.beans.SimpleDynamicMethod void javafx.application.Platform.runLater(Runnable)]\'');
  });

});
