//watch files 3
/*globals  _, pretty */
(function () {
  'use strict';
  var root = this;
  var watch = {};
  var trace = print;

  watch.init = function (state) {};

  watch.update = function (state) {
    for (var i = 0; i < state.list.length; i = i + 1) {
      // print('i -> ' + i + ' : ' +  state.list.length);
      var obj = state.list[i];
      var newTime = watch.lastModified(obj.path);
      if ((newTime > obj.time) || _.isUndefined(obj.time)) {
        print('RELOAD: ' + (obj.name || obj.path));
        obj.time = newTime;
        root[obj.cb](obj);
      }
    }
  };

  watch.lastModified = function (path) {
    return new java.io.File(path).lastModified();
  };

  return watch;

}).call(this);
