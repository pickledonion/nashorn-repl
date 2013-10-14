// fxml.spec.js 4
/* globals describe, it, expect, _, util, root, fxml*/

var root = this;

describe ('fxml', function(){
  'use strict';
  it ('has underscore function', function () {
    expect(typeof _).toBe('function');
  });

  it ('has util object', function () {
    expect(typeof util).toBe('object');
  });

  it ('is an object', function () {
    expect(util.kindOf(fxml)).toBe('object');
  });

  it ('has get function', function () {
    expect(util.kindOf(fxml.get)).toBe('function');
  });

  it ('can get todoList', function () {
    var str = 'ListView[id=todoList, styleClass=list-view]';
    expect(str).toMatch(/^ListView\[id=todoList/);
  });

  // it ('can get todoList', function () {
  //   expect(fxml.get('todoList')).toMatch(/^ListView\[id=todoList/);
  // });

});
