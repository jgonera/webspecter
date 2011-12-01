var EventEmitter = require('events').EventEmitter;
var PageQuery = require('./PageQuery');

var Browser = module.exports = function Browser() {
  var self = this;
  this.page = require('webpage').create();
  this.loaded = false;
  
  this.page.onConsoleMessage = function(msg) {
    console.log(msg);
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

Browser.prototype.pageLoaded = function() {
  return this.loaded;
};

Browser.prototype.get = function(url, callback) {
  this.url = url;
  this.page.open(encodeURI(url), callback);
};

Browser.prototype.query = function(query) {
  return new PageQuery(this, query);
};

Browser.prototype.onLoad = function(callback) {
  if (this.loaded) {
    callback(this.error);
  } else {
    this.once('loadFinished', callback);
  }
};
