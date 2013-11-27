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

  loading.getDefaultLoadList = function(project, component) {
    var modules =  [
      { assign: false,
        path: 'underscore/underscore.js'},
      { assign: false,
        path:'underscore-contrib/underscore.function.arity.js'},
      { path:'nashorn-repl/lib/fx.js'},
      { path: 'nashorn-repl/lib/fxml.js'},
      {path:'nashorn-repl/lib/util.js'},
      { name:'inspector', cb:'nodeLoadModule',
        path: 'nashorn-repl/lib/node-util.js' },
       {path:'nashorn-repl/lib/pretty.js'},
       {path:'nashorn-repl/lib/repl.js'},
       {path:'nashorn-repl/lib/watch.js'},
       {path:'nashorn-repl/lib/loading.js'}
    ];
    for (var i = 0; i < modules.length; i = i + 1 ) {
      var module = modules[i];
      module.path = project + component + module.path;
    }
    return modules;

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
      load(root.modulePath + 'jasmine-nashorn/lib/specrunner.js');
    root.specrunner.init();
    load(root.modulePath + 'jasmine/lib/jasmine-core/jasmine.js');
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

  loading.init = function (proj, comp, modules) {
    root.modulePath = proj + comp;
    var getPath = function (path) {  return proj + comp + path; };

    load(getPath('underscore/underscore.js'));
    root.util = load(getPath('nashorn-repl/lib/util.js'));
    root.watch = load(getPath('nashorn-repl/lib/watch.js'));

    modules = _.map(modules, loading.getModule);

    root.watchState = {list:[], load:true};
    util.pushList(watchState.list, modules);

    var tests = loading.getTestList(modules);
    var testWatchs = _.map(tests, function (str) {
      return { path:proj + str};
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
