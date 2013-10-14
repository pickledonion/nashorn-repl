//loading.js nashorn-repl 7
/*global _, util, fxml, repl, app, watch*/
/*global fxmlText, doc*/
/*global replThread, replState*/
/*global watchThread, watchState*/
/*global trace, prn, jasmine */

(function () {
  'use strict';
  var root = this;
  root.trace = function (str) { print( 'TRACE ' + str); };
  root.prn = root.prn || print;

  var loading = {};

  loading.defaultModule = { assign: true, load: true, cb:'loadModule' };

  loading.getModule = function (obj) {
    if (_.isString(obj)) { obj = {path: obj};}
    obj = _.extend({}, loading.defaultModule, obj);
    obj.name = obj.name || loading.getName(obj.path);
    return obj;
  };

  loading.getName = function (path) {
    return (_.last((path).split('/')).split('.'))[0];
  };

  root.loadModule = function (obj) {
    util.tryCatch( function () {
      if (!obj.load) {
        obj.load = true;
        print('NOLOAD ' + obj.load);
        return;
      }
      var res = load(obj.path);
      if (obj.assign) {root[obj.name] = res;}
      if (obj.test) {
        util.later(function () {
          root.runTestFolder();
          // root.runTest({path: 'test/' + obj.name + '.spec.js'});
        });
      }
      obj.test = true;
    }, function (e) {
      print('LOADMODULE E -> ' + e);
    });
  };

  // loading.getTests = function () {
  //   var dirs = 'test/';
  //   return _.map (util.getSubFolder(dir), function (f) {
  //     var path = dir + f;
  //     return { path: path, cb: 'runTestFolder', load:false };
  //   });
  // };

  loading.resetJasmine = function () {
    root.specrunner =
      load('bower_components/jasmine-nashorn/lib/specrunner.js');
    root.specrunner.init();
    load('bower_components/jasmine/lib/jasmine-core/jasmine.js');
    jasmine.getEnv().addReporter(new root.specrunner.reporter());
    root.specCounter = 0;
  };

  loading.getTests = function () {
    var dir = 'test/';
    var testFolders = util.getSubFolder('test/');
    var comps = util.getSubFolder('bower_components/');
    _.each(comps, function (comp) {
      _.each(util.getSubFolder(comp + '/test/'), function (file) {
        if (/spec.js$/.test(file)) {testFolders.push(file);}
      });
    });
    return testFolders;
  };

  root.runTestFolder = function (obj) {
    if ( obj && !obj.load) {
      obj.load = true;
      return;
    }
    print('\nTESTING: \n');
    var loader = function (path) {
      root.currentTest = path;
      util.tryCatch(function () {load(path);});
    };
    loading.resetJasmine();

    _.each(loading.getTests(), loader);
    root.specrunner.run();
  };

  root.runTest = function (obj) {
    if (!obj.load) {
      obj.load = true;
      print('NOLOAD ' + obj.load);
      return;
    }
    loading.resetJasmine();
    util.tryCatch(function () { load(obj.path); });
    root.specrunner.run();
  };

  loading.watch = function (modules) {
    load('bower_components/underscore/underscore.js');
    root.util = load('bower_components/nashorn-repl/lib/util.js');
    root.watch = load('bower_components/nashorn-repl/lib/watch.js');

    modules = _.map(modules, loading.getModule);

    var list = [];
    root.watchState = {list:list};
    util.pushList(list, modules);

    util.pushList(list, _.map(loading.getTests(),
                        function (str) {
                          return {load:false, path:str, cb:'runTestFolder'};
                        }));

    watch.update(root.watchState);
  };

  root.nodeLoadModule = function (obj) {
    var path = obj.path;
    var str = util.read(path);
    root[obj.name] = util.nodeLoad(str);
  };

  return loading;

}).call(this);
