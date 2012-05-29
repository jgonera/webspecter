var EventEmitter = require('events').EventEmitter;
var PageQuery = require('./PageQuery');
var util = require('util');
var injectArgs = require('./utils').injectArgs;
var config = require('./environment').config;


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
  // custom inspect() to avoid getting stuck in inspect() from util
  // (Object.keys seems to cause an infinite loop/recursion)
  this.page.inspect = function() { return '[PhantomJS WebPage]'; };
  this.loaded = false;
  this.error = null;
  this.url = null;
  this.initialUrl = null;
  
  this.page.viewportSize = { width: 1024, height: 768 };
 
  if (config.console) {
    this.page.onConsoleMessage = function(msg, line, fileName) {
      console.error('%s:%d %s', fileName, line, msg);
    };
  }

  this.page.onLoadStarted = function() {
    self.loaded = false;
  };

  this.page.onLoadFinished = function(status) {
    self.url = self.page.evaluate(function() {
      return document.location.href;
    });
    if (status !== 'success') {
      // TODO: self.url is not the last URL if the last page is not loaded
      self.error = new Error("Unable to load " + self.url);
    } else {
      self.error = null;
    }
    self.loaded = true;
    self.emit('loadFinished', self.error);
  };
};

Browser.prototype = new EventEmitter;

Browser.prototype.visit = function(url, callback) {
  if (url.match(/^\w+:\/\//)) {
    this.initialUrl = url;
  } else {
    this.initialUrl = config.baseUrl + url;
  }
  if (callback) this.once('loadFinished', callback);
  this.page.open(encodeURI(this.initialUrl));
};

Browser.prototype.query = function(query) {
  return new PageQuery(this, query);
};

Browser.prototype.onceLoaded = function(callback) {
  if (this.loaded) {
    callback(this.error);
  } else {
    this.once('loadFinished', callback);
  }
};

Browser.prototype.reload = function(callback) {
  this.visit(this.url, callback);
};

Browser.prototype.reloadInitial = function(callback) {
  this.visit(this.initialUrl, callback);
};

Browser.prototype.evaluate = function(args, fn) {
  this.page.evaluate(injectArgs(args, fn));
};

