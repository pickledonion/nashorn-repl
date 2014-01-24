/*
 * Copyright (c) 2013, Oracle and/or its affiliates.
 * All rights reserved. Use is subject to license terms.
 *
 * This file is available and licensed under the following license:
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 *
 *  - Redistributions of source code must retain the above copyright
 *    notice, this list of conditions and the following disclaimer.
 *  - Redistributions in binary form must reproduce the above copyright
 *    notice, this list of conditions and the following disclaimer in
 *    the documentation and/or other materials provided with the distribution.
 *  - Neither the name of Oracle Corporation nor the names of its
 *    contributors may be used to endorse or promote products derived
 *    from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

// fx 2
/*global _, util, fx, trace*/

(function () {
  "use strict";
  var root = this;
  var fxml = {};

  fxml.openWindow = function () {
    if(!$STAGE.scene) {
      $STAGE.scene = new fx.Scene(new fx.Group(
        new fx.Button('test')), 400, 400);
      $STAGE.show();
    }
  };

  fxml.setScene = function (fxmlPath, cssPath) {
    //print('in setScene');
    fxml.openWindow();
    //$STAGE.scene.root = fxml.load(util.read(fxmlPath));
    var url = new java.io.File(fxmlPath).toURI().toURL();
    var nodes = javafx.fxml.FXMLLoader.load(url);
    $STAGE.scene = new fx.Scene(nodes);
    if (_.isString(cssPath)) {
    $STAGE.scene.stylesheets.clear();
    $STAGE.scene.stylesheets
      .add(new java.io.File(cssPath).toURI().toURL().toString());
    }
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
