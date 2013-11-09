//loading.js nashorn-repl 10
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
    return _.initial(_.last(path.split('/')).split('.')).join('.');
  };

  loading.getDefaultLoadList = function() {
    return [
      { assign: false,
        path:'bower_components/underscore/underscore.js'},
      { assign: false,
        path:'bower_components/underscore-contrib/underscore.function.arity.js'},
      'bower_components/nashorn-repl/lib/fx.js',
      'bower_components/nashorn-repl/lib/fxml.js',
      'bower_components/nashorn-repl/lib/util.js',
      { name:'inspector', cb:'nodeLoadModule',
        path: 'bower_components/nashorn-repl/lib/node-util.js' },
      'bower_components/nashorn-repl/lib/pretty.js',
      'bower_components/nashorn-repl/lib/repl.js',
      'bower_components/nashorn-repl/lib/watch.js',
      'bower_components/nashorn-repl/lib/loading.js',
    ];
  };

  root.loadModule = function (obj) {
    util.tryCatch( function () {
      var res = load(obj.path);
      if (obj.assign) {root[obj.name] = res;}
    }, function (e) {
      print('LOADMODULE E -> ' + e);
    });
  };

  root.runModuleTests =  function () {
    print('in runModuleTests');
    root.runTests(loading.getTestList(root.loadList));
  };

  loading.resetJasmine = function () {
    root.specrunner =
      load('bower_components/jasmine-nashorn/lib/specrunner.js');
    root.specrunner.init();
    load('bower_components/jasmine/lib/jasmine-core/jasmine.js');
    jasmine.getEnv().addReporter(new root.specrunner.reporter());
    root.specCounter = 0;
  };

  loading.getTestList = function (loads) {
    var paths =_.map(loads, function (o) {
      return _.isString(o) ? o : o.path;
    });
    var fileFunc = function (o) {return new java.io.File(o).getCanonicalFile();};
    var files = _.map(paths, fileFunc);
    var specs = _.flatten(_.map(files, function (o) {
      var name = loading.getName(o.getName());
      return [ o.getParentFile().getParent() + '/test/' + name + '.spec.js',
               o.getParent() + '/test/' + name + '.spec.js'];
    }));
    var specFiles = _.map(specs, fileFunc);
    var finds = _.filter(specFiles, function (f) {
      return f.exists();
    });
    var canonical = function (f) {return f.getCanonicalPath(); };
    var uniqs = _.uniq(_.map(finds, canonical));
    return uniqs;
  };

  root.runTests = function (tests) {
    print('TESTING:');
    var loader = function (path) {
      root.currentTest = path;
      util.tryCatch(function () {load(path);});
    };
    loading.resetJasmine();
    _.each(tests, loader);
    root.specrunner.run();
    repl.prompt();
  };

  root.runTest = function (obj) {
    if (!loading.checkLoad(obj)) { return; }
    loading.resetJasmine();
    util.tryCatch(function () { load(obj.path); });
    root.specrunner.run();
  };

  loading.init = function (modules) {
    load('bower_components/underscore/underscore.js');
    root.util = load('bower_components/nashorn-repl/lib/util.js');
    root.watch = load('bower_components/nashorn-repl/lib/watch.js');

    modules = _.map(modules, loading.getModule);

    root.watchState = {list:[], load:true};
    util.pushList(watchState.list, modules);

    var tests = loading.getTestList(modules);
    var testWatchs = _.map(tests, function (str) {
      return { path:str};
    });
    util.pushList(watchState.list, testWatchs);

    watch.update(root.watchState);
    root.watchState.load = false;
  };

  root.nodeLoadModule = function (obj) {
    var path = obj.path;
    var str = util.read(path);
    root[obj.name] = util.nodeLoad(str);
  };

  return loading;

}).call(this);
