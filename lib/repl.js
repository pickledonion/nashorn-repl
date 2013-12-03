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


//repl.js a
/*globals _, inspect*/
(function () {
  var root = this;
  var repl = {};

  var bufferedReader = new java.io.BufferedReader(
    new java.io.InputStreamReader(java.lang.System['in']));
  var lines = '';
  var err = 'none';
  var cmds = [
    { keys: ['.stop', '.'], fun: stop },
    { keys: ['.spew', '?'], fun: spew }
  ];
  var spewFlag = false;
  var spewCode = '';

  function spew() {
    spewFlag = true;
    if(lines !== '') { stop(); }
  }

  function stop() {
    print('ERROR = ' + err);
    if (err !== 'none') {
      // spewFlag = true;
      spewCode  = lines;
      lines = '';
      err = 'none';
    }
  }

  function checkCommand(line) {
    for (var i in cmds) {
      var cmd = cmds[i];
      if (cmd.keys.indexOf(line) !== -1) {
        cmd.fun();
        if (spewFlag === false) repl.prompt();
        return true;
      }
    }
    return false;
  }

  function readEvalPrint(state) {
    try {
      var line = bufferedReader.readLine().trim();
      if (!checkCommand(line)) {
        lines += line;
        lines += '\n';
        print(state.filter(eval.apply(root, [lines])));
        repl.prompt();
        lines = '';
      }
    } catch (e) {
      err = e;
      repl.prompt('... ');
    }
    if (spewFlag === true) {
      print('STACK TRACE ...');
      eval.apply(this, [spewCode]);
    }
  }

  repl.prompt = function (pr) {
    var prm = pr || 'fx> ';
    java.lang.System.out.print(prm);
  }

  repl.update = function (state) {
    if (spewFlag === true) {
      spewFlag = false;
      repl.prompt();
    }
    if (bufferedReader.ready()) {
      if (state.later) {
        var func = function () { readEvalPrint(state); };
        javafx.application.Platform.runLater(func);
      } else {
        new java.lang.Thread(function () { readEvalPrint(state); }).start();
      }
    }
  }

  return repl;

}).call(this);
