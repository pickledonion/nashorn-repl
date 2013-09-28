/*globals _, util, fxml, repl*/
(function () {
  "use strict";

  var root = this;

  // var fxmlText = util.read('assets/todo.fxml');
  // var doc = new root.XmlDocument(fxmlText);

  // var r = $STAGE.scene.root;
  // // node = r.children[0];

  // // _.find(util.javaToArray(r.children), function (c) { return c === node;});

  // var walk = function (node, pred, child, result) {
  //   return _.reduce(node,
  //                   function (memo, val) {
  //                     if (pred(val)) { memo.push(val); }
  //                     if (_.isArray(child(val))) {
  //                       memo.concat(walk(child(val), pred, child, memo));
  //                     }
  //                     return memo;
  //                   },
  //                   result);
  // };

  // var node = r.children[1].children[0];

  // walk([$STAGE.scene.root],
  //      function (o) {
  //        return _.find(util.javaToArray(o.children),
  //                      function (c) { return c === node;});
  //      },
  //      function (o) { return util.javaToArray(o.children); },
  //      []);

  print('fxml.nodeFromId');
  var n = fxml.nodeFromId('todo-item');
  print(n);
  var p = fxml.parent(n);
  print('p? = ' + p);

  // what am i doing ?
  // i am removing a dom node from its parent.
  // need to trace.


}).call(this);
