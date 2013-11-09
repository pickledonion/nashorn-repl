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
