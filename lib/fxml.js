/*global _, util, fx, trace*/

(function () {
  "use strict";
  var root = this;
  var fxml = {};

  fxml.openWindow = function () {
    $STAGE.scene = new fx.Scene(new fx.Group(
      new fx.Button('test')), 400, 400);
    $STAGE.show();
  };

  fxml.setScene = function (fxmlPath, cssPath) {
    $STAGE.scene.root = fxml.load(util.read(fxmlPath));
    $STAGE.scene.stylesheets.clear();
    $STAGE.scene.stylesheets
      .add(new java.io.File(cssPath).toURI().toURL().toString());
  };

  fxml.load = function (xmlText) {
    // print('LOADFXML = ' + path);
    var bytes = (xmlText).getBytes();
    var stream = new java.io.ByteArrayInputStream(bytes);
    //fxml.stream.reset();
    var loader = new javafx.fxml.FXMLLoader();
    var nodes = loader.load(stream);
    return nodes;
  };

  // fxml.nodePath = function (p, node) {
  //   // root.put(p);
  //   var path = util.clone(p);
  //   path.shift();
  //   _.each(path, function (which) {
  //     // print('node: ' + node);
  //     // print(node.children);
  //     node = node.children[which];
  //   });
  //   return node;
  // };

  // fxml.searchLabel = function (label, rootNode) {
  //   return fxml.searchNodes(function(node) {
  //     return (fxml.getData(node,0) === label);
  //   }, rootNode);
  // };

  // fxml.getData = function (node, i, sep) {
  //   var s = sep || ':';
  //   return ((node.userData || '').split(s)[i] || '').trim();
  // };

  // fxml.searchNodes = function (testFunc, node) {
  //   var down = function(obj) {
  //     return util.javaToArray(obj.children);
  //   };
  //   var recur = function(obj) {
  //     return (_.size(util.javaToArray(obj.children)) > 0);
  //   };
  //   var result = [];

  //   function findProp(obj, k) {
  //     if (testFunc(obj)) { result.push(obj); }
  //     return recur(obj);
  //   }

  //   util.walk( {
  //     recur: findProp,
  //     down: down
  //   }, node);
  //   return result;
  // };

  fxml.walk = function (node, pred, child, result) {
    var reduceFunc = function (memo, val) {
      if (pred(val)) { memo.push(val); }
      if (_.isArray(child(val))) {
        memo.concat(fxml.walk(child(val), pred, child, memo));}
      return memo;
    }
    return _.reduce(node, reduceFunc, result);
  };

  // fxml.parent = function (node) {
  //   var pred = function (o) {
  //     return _.find(util.javaToArray(o.children),
  //                   function (c) { return c === node;});
  //   };
  //   var child = function (o) { return util.javaToArray(o.children) };
  //   return fxml.walk([$STAGE.scene.root], pred, child, []);
  // };

  fxml.get = function (id) { return $STAGE.scene.root.lookup('#'+id);};

  // fxml.get = function (id) {
  //   return _.first(fxml.walk([$STAGE.scene.root],
  //                            function (o) {return o.id === id;},
  //                            function (o) {return util.javaToArray(o.children);},
  //                            []));
  // };

  // fxml.remove = function (node, context) {
  //   return 30;
  // };

  return fxml;

}).call(this);
