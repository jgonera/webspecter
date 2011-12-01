var fs = require('fs');

var getFiles = exports.getFiles = function(path) {
  var i, entry, list, files = [];
  if (fs.isFile(path)) {
    return [path];
  }
  list = fs.list(path);
  for (i=0; i<list.length; ++i) {
    if (list[i] === '.' || list[i] === '..') continue;
    
    entry = fs.absolute(path + fs.separator + list[i]);
    if (fs.isDirectory(entry)) {
      files.push.apply(files, getFiles(entry));
    } else if (entry.match(/\.(js|coffee)$/)) {
      files.push(entry);
    }
  }
  
  return files;
};

exports.injectArgs = function(args, fn) {
  var stringifyArgs = function(argsString) {
    var splittedArgs = argsString.split(',');
    for (var i=0; i<splittedArgs.length; ++i) {
      splittedArgs[i] = JSON.stringify(splittedArgs[i].trim());
    }
    return splittedArgs.join(', ');
  };
  
  var newFn, normalArgs, code = fn.toString();
  
  code = code.replace(/function .*\((.*?)\) {/, function(str, p1) {
    var name, arg, newStr = "";
    normalArgs = p1;
    for (name in args) {
      arg = args[name];
      if (arg instanceof Function) {
        newStr += "var $" + name + " = " + arg.toString() + ";\n";
      } else {
        newStr += "var $" + name + " = " + JSON.stringify(arg) + ";\n";
      }
    }
    return newStr;
  });
  code = code.slice(0, -1);
  if (normalArgs === '') {
    newFn = new Function(code);
  } else {
    newFn = eval('new Function(' + stringifyArgs(normalArgs) + ', code)');
  }
  //console.log(newFn.toString());
  return newFn;
};

exports.extend = function(object, source) {
  for (var key in source) {
    if (!object.hasOwnProperty(key)) object[key] = source[key];
  }
};

