var EventEmitter = require('events').EventEmitter;
var Browser = require('./Browser');

var FeatureManager = exports.FeatureManager = function FeatureManager() {
  this.features = [];
  this.ready = true;
};

FeatureManager.prototype.addFeature = function(feature) {
  // add page to the chain-loading
  var lastFeature = this.features.slice(-1)[0];
  if (lastFeature) {
    lastFeature.on('pageLoaded', feature.loadPage.bind(feature));
  }
  // add feature
  this.features.push(feature);
};

FeatureManager.prototype.loadFeatures = function() {
  // start chain-loading pages
  if (this.features.length) this.features[0].loadPage();
  
  // load all the features
  this.features.forEach(function(feature) {
    feature.load();
  });
};

var Feature = exports.Feature = function Feature(suite, options, fn) {
  this.suite = suite;
  this.url = options.url;
  this.fn = fn;
  this.browser = new Browser;
};

Feature.prototype = new EventEmitter;

Feature.prototype.load = function() {
  var browser = this.browser;
  this.suite.emit('pre-require', global);
  this.suite.beforeAll(function(done) {
    global.browser = browser;
    global.$ = browser.query.bind(browser);
    browser.onLoaded(done);
  });
  
  this.fn();
  this.suite.emit('post-require', global);  
};

Feature.prototype.loadPage = function() {
  this.browser.get(this.url);
  this.browser.onLoaded(function() {
    this.emit('pageLoaded');
  }.bind(this));
};

