var EventEmitter = require('events').EventEmitter;
var PageQuery = require('./PageQuery');
var util = require('util');

var PageError = function(message, line, fileName) {
  this.name = 'PageError';
  this.message = message;
  this.line = line;
  this.fileName = fileName;
};
util.inherits(PageError, Error);

var Browser = module.exports = function Browser() {
  var self = this;
  this.page = require('webpage').create();
  this.loaded = false;
  
//  this.page.viewportSize = { width: 1024, height: 768 }
  
  this.page.onConsoleMessage = function(msg, line, fileName) {
//    if (msg.indexOf('Error') !== -1) {
//      throw new PageError(msg, line, fileName);
//    } else {
      console.log('%s:%d %s', fileName, line, msg);
//    }
  };

  this.page.onLoadStarted = function() {
    self.loaded = false;
  };

  this.page.onLoadFinished = function(status) {
    if (status !== 'success') {
      self.error = new Error("Unable to load " + self.url);
    } else {
      self.error = null;
    }
    self.loaded = true;
    self.emit('loadFinished', self.error);
  };
};

Browser.prototype = new EventEmitter;

Browser.prototype.get = function(url) {
  this.url = url;
  this.page.open(encodeURI(url));
};

Browser.prototype.query = function(query) {
  return new PageQuery(this, query);
};

Browser.prototype.onLoaded = function(callback) {
  if (this.loaded) {
    callback(this.error);
  } else {
    this.once('loadFinished', callback);
  }
};
