//pretty.js 6
/* globals _, util, prn, inspector */
(function () {
  'use strict';
  var root = this;
  var pretty = {};

  pretty.javaFilter = function (o) {
    if (util.isJava(o)) {
      return 'J:' + o;
    }  else {
      return o;
    }
  };

  pretty.opts = { colors:true, depth:null };
  pretty.format = function (o, opts) {
    opts = opts || pretty.opts;
    if (util.kindOf(o) === 'function') {  return o.toString(); }
    return inspector.inspect(util.mapWalk(pretty.javaFilter, o), opts);
  };
  pretty.print = function (o, opts) { print(pretty.format(o, opts)); };
  root.prn = pretty.print;
  return pretty;

}).call(this);
