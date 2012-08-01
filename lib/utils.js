var fs = require('fs');
var dirname = require('path').dirname;

var findFiles = exports.findFiles = function(path) {
  var i, entry, list, files = [];
  if (fs.isFile(path)) {
    return [fs.absolute(path)];
  }
  list = fs.list(path);
  for (i=0; i<list.length; ++i) {
    if (list[i] === '.' || list[i] === '..') continue;
    
    entry = fs.absolute(path + fs.separator + list[i]);
    if (fs.isDirectory(entry)) {
      files.push.apply(files, findFiles(entry));
    } else if (entry.match(/\.(js|coffee)$/)) {
      files.push(entry);
    }
  }
  
  return files;
};

exports.findEnvFile = function(path) {
  path = fs.absolute(path);
  while (path.length > 1) {
    if (fs.isFile(path + fs.separator + 'env.js')) {
      return path + fs.separator + 'env.js';
    } else if (fs.isFile(path + fs.separator + 'env.coffee')) {
      return path + fs.separator + 'env.coffee';
    }
    path = dirname(path);
  }
  return null;
};

exports.getPath = function(path) {
  path = path || './spec';
  if (path[0] !== '/' && path[0] !== '.') path = './' + path;
  return path;
};

exports.injectArgs = function() {
  var str, arg, i, l = arguments.length - 1;
  var func = arguments[l];

  str = 'return (' + func.toString() + ')(';
  for (i = 0; i < l; i++) {
    arg = arguments[i];
    if (/object|string/.test(typeof arg) && !(arg instanceof RegExp)) {
      str += 'JSON.parse(' + JSON.stringify(JSON.stringify(arg)) + '),';
    } else {
      str += arg + ',';
    }
  }
  str = str.replace(/,$/, '') + ');';
  return new Function(str);
};

exports.extend = function(object, source) {
  for (var key in source) {
    if (!object.hasOwnProperty(key)) object[key] = source[key];
  }
};

