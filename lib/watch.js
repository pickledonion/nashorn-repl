//watch files 3
/*globals  _, pretty */
(function () {
  'use strict';
  var root = this;
  var watch = {};
  var trace = print;

  watch.init = function (state) {};

  watch.update = function (state) {
    if (state.test) {
      runModuleTests();
      state.test = false;
    };

    _.each(state.list, function (obj) {
      var newTime = watch.lastModified(obj.path);
      if ((newTime > obj.time) || _.isUndefined(obj.time)) {
        print((state.load ? 'LOAD: ' : 'RELOAD: ') + (obj.name || obj.path));
        obj.time = newTime;
        if ((state.load && obj.load) || (!state.load)) {
          if (obj.cb) { root[obj.cb](obj); }
          state.test = true;
        }
      }
    });
  };

  watch.lastModified = function (path) {
    return new java.io.File(path).lastModified();
  };

  return watch;

}).call(this);
