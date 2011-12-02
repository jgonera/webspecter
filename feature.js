var EventEmitter = require('events').EventEmitter;
var Browser = require('./Browser');

var FeatureManager = exports.FeatureManager = function FeatureManager() {
  this.features = [];
  this.ready = true;
};

FeatureManager.prototype.addFeature = function(feature) {
  var lastFeature = this.features.slice(-1)[0];
  if (lastFeature) {
    lastFeature.on('pageLoaded', feature.loadPage.bind(feature));
  }
  this.features.push(feature);
};

FeatureManager.prototype.loadFeatures = function() {
  this.features[0].loadPage();
};

var Feature = exports.Feature = function Feature(suite, url, fn) {
  this.url = url;
  var browser = this.browser = new Browser;
  suite.emit('pre-require', global);
  suite.beforeAll(function(done) {
    global.browser = browser;
    global.$ = browser.query.bind(browser);
    browser.onLoaded(done);
  });
    
  fn();
  suite.emit('post-require', global);
};

Feature.prototype = new EventEmitter;

Feature.prototype.loadPage = function() {
  this.browser.get(this.url);
  this.browser.onLoaded(function() {
    this.emit('pageLoaded');
  }.bind(this));
};

