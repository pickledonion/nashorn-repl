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
