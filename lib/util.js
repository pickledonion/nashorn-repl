/*global _, Packages */
//util.js 4
(function () {
  "use strict";
  var util = {};
  var root = this;

  util.getTypes = function (input, contexts) {
    var output = {};
    contexts = [].concat(output).concat(contexts);
    _.each(input, function (item) {
      if (util.kindOf(item) === 'array') {
        output[item[0]] = util.stringToJava(item[1], contexts);
      } else {
        output[_.last(item.split('.'))] = util.stringToJava(item, contexts);
      }
    });
    return output;
  };

  util.stringToJava = function (str, contexts) {
    try {
      return Java.type(str);
    } catch (e) {
      var ary = str.split('.');
      var nextPackage = function (context, name) { return (new Function('return this.' + name)).call(context);};
      var tops = _.map(contexts, function (cxt) {
        return nextPackage(cxt, _.first(ary));
      });
      var top = _.find(tops, function (cxt) {
        return !_.isUndefined(cxt);
      });
      return _.reduce(_.rest(ary), nextPackage, top);
    }
  };

  util.walk = function (node, pred, child, result) {
    var reduceFunc = function (memo, val) {
      if (pred(val)) { memo.push(val); }
      if (_.isArray(child(val))) {
        memo.concat(util.walk(child(val), pred, child, memo));}
      return memo;
    };
    return _.reduce(node, reduceFunc, result);
  };

  // curry/auto is from wu.js
  var toArray = function(x) {
    return Array.prototype.slice.call(x);
  };

  var curry = function (fn /* variadic number of args */) {
    var args = Array.prototype.slice.call(arguments, 1);
    var f = function () {
      return fn.apply(this, args.concat(toArray(arguments)));
    };
    return f;
  };

  var autoCurry = function (fn, numArgs) {
    numArgs = numArgs || fn.length;
    var f = function () {
      if (arguments.length < numArgs) {
        return numArgs - arguments.length > 0 ?
          autoCurry(curry.apply(this, [fn].concat(toArray(arguments))),
                    numArgs - arguments.length) :
          curry.apply(this, [fn].concat(toArray(arguments)));
      }
      else {
        return fn.apply(this, arguments);
      }
    };
    f.toString = function(){ return fn.toString(); };
    f.curried = true;
    return f;
  };

  Function.prototype.autoCurry = function(n) {
    return autoCurry(this, n);
  };

  util.kindOf = function (o) {
    if (_.isArray(o)) { return 'array'; }
    if (util.isJava(o)) { return 'java'; }
    if(o === null) { return 'null'; }
    return typeof o;
  };

  util.later = javafx.application.Platform.runLater;

  util.time = function (func) {
    var t1 = new Date().getTime();
    func();
    var t2 = new Date().getTime();
    return t2 - t1;
  };

  util.isJava = function (o) {
    return (_.isObject(o) || _.isFunction(o)) &&
      (o.class !== undefined || o.toString === undefined);
  };

  util.javaToArray = function (input) {
    var result = [];
    for each(var i in input) {
      result.push(i);
    }
    return result;
  };

  util.getFolder = function (path) {
    return util.javaToArray(new java.io.File(path).list());
  };

  util.getSubFolder = function (dir) {
    return _.map(util.getFolder(dir), function (file) {
      return dir + file;
    });
  };

  util.read = function (file) {
    var fr = new java.io.FileReader(file);
    var tr = new java.io.BufferedReader(fr);
    var line = null;
    var sb = new java.lang.StringBuilder();
    try {
      while ((line = tr.readLine()) !== null)  {
        sb.append(line);
        sb.append("\n");
      }
    } finally {
      fr.close();
    }
    return sb.toString();
  };


  util.mapWalk = function (func,  obj, loopList) {
    loopList = loopList || [];
    var copyMap = { 'array': function () { return []; },
                    'function': function (o) { return o; },
                    'object': function () { return {}; }};
    var newObjFun = copyMap[util.kindOf(obj)];
    var newObj = _.isUndefined(newObjFun) ? func(obj): newObjFun(obj);

    if (_.contains(['object', 'array'], util.kindOf(obj))) {
      if (_.contains(loopList, obj)) {
        newObj = '[Circular]';
      } else {
        loopList.push(obj);
        _.forEach(obj, function (o, i) {
          newObj[i] = util.mapWalk(func, o, loopList);
        });
      }
    }
    return newObj;
  };

  util.clone = function (obj) {
    return JSON.parse(JSON.stringify(obj));
  };

  util.stopThread = function (it, thread, module , state) {
    var t = it[thread];
    // print('t -> ' + t);
    // print('is ?', _.isObject(t));
    if(_.isObject(t)){
      print('STOPPING');
      it[state].running = false;
      java.lang.Thread.sleep(10);
    }
  };

  util.startThread = function (it, thread, module, state, gap ) {
    gap = gap || 100;
    util.stopThread(it, thread, module, state);
    it[state].running = true;
    var t = new java.lang.Thread(function () {
      it[module].init(it[state]);
      while (it[state].running) {
        java.lang.Thread.sleep(gap);
        it[module].update(it[state]);
      }
      print('THREAD EXIT');
    });
    t.start();
    it[thread] = t;
  };



  util.get = function (prop, obj) { if (obj !== null) {return obj[prop];} }.autoCurry();
  util.set = function (prop, val, obj) { obj[prop] = val; return obj; }.autoCurry();

  util.run = function (fun, args) { return fun && fun.apply(null, args); };

  util.tryCatch = function (tryFun, catchFun, finallyFun ) {
    catchFun = catchFun || function (e) { print('E -> ' + e);};
    try {
      util.run(tryFun);
    } catch (e) {
      util.run(catchFun, [e]);
    } finally {
      util.run(finallyFun);
    }
  };

  util.nodeLoad = function (str) {
    var wrap = '(function () { ' +
      'var module = {}, exports = {}, process = {};' +
      str +
      ' return (module.exports || exports); }());';
    return eval(wrap);
  };

  util.array = Array.prototype;
  util.push = util.array.push;
  util.concat = util.array.concat;

  util.pushList = function (list1, list2) {
    util.push.apply(list1, list2);
  };

  util.concat = function (list1, list2) {
    return Array.prototype.concat.call(list1, list2);
  };

  util.line = function () {
    return '--------------------';
  };

  return util;

}).call(this);
