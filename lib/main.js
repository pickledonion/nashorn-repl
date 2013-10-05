//main.js nashorn-repl
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

  var main = {};

  main.defaultModule = { assign: true, load: true, cb:'loadModule' };

  main.getModule = function (obj) {
    if (_.isString(obj)) { obj = {path: obj};}
    obj = _.extend({}, main.defaultModule, obj);
    obj.name = obj.name || main.getName(obj.path);
    return obj;
  };

  main.getName = function (path) {
    return (_.last((path).split('/')).split('.'))[0];
  };

  root.loadModule = function (obj) {
    util.tryCatch( function () {
      if (!obj.load) {
        obj.load = true;
        print('NOLOAD ' + obj.load);
      }
      var res = load(obj.path);
      if (obj.assign) {root[obj.name] = res;}
      if (obj.test) {
        util.later(function () {
          root.runTest({path: 'test/' + obj.name + '.spec.js'});
        });
      }
      obj.test = true;
    }, function (e) {
      print('LOADMODULE E -> ' + e);
    });
  };

  main.getTests = function () {
    var dir = 'test/';
    return _.map (util.getFolder(dir), function (f) {
      var path = dir + f;
      return { path: path, cb: 'runTest', load:true };
    });
  };

  root.runTest = function (obj) {
    print('\n--------------------\n');
    print('TEST: ');
    prn(obj);
    root.specrunner = load('bower_components/jasmine-nashorn/lib/specrunner.js');
    root.specrunner.init();
    load('bower_components/jasmine/lib/jasmine-core/jasmine.js');
    jasmine.getEnv().addReporter(new root.specrunner.reporter());
    util.tryCatch(function () { load(obj.path); });
    root.specrunner.run();
    print('\n--------------------\n');
  };

  main.getAssets = function () {
    var dir = 'assets/';
    var fxml = dir + 'todo.fxml';
    var css = dir + 'todo.css';
    return [{ path:fxml, fxml:fxml, css:css, cb:'loadAssets' },
            { path:css, fxml:fxml, css:css, cb:'loadAssets' }];
  };

  root.loadAssets = function (obj) {
    util.later( function () {
      fxml.setScene(obj.fxml, obj.css);
      app.init(root.appState);
    });
    // root.doc = new XmlDocument(fxmlText);
  };

  main.watch = function (modules) {
    load('bower_components/underscore/underscore.js');
    root.util = load('bower_components/nashorn-repl/lib/util.js');
    root.watch = load('bower_components/nashorn-repl/lib/watch.js');

    modules = _.map(modules, main.getModule);

    // _.each(modules, function (obj) {
    //   obj.time = watch.lastModified(obj.path);
    // });

    var list = [];
    root.watchState = {list:list};
    util.pushList(list, modules);

    util.pushList(list, main.getAssets());
    util.pushList(list, main.getTests());
    watch.update(root.watchState);
  };

  root.nodeLoadModule = function (obj) {
    var path = obj.path;
    var str = util.read(path);
    root[obj.name] = util.nodeLoad(str);
  };

  return main;

}).call(this);
