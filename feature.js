var EventEmitter = require('events').EventEmitter;
var Browser = require('./Browser');
var Waiter = require('./waiter').Waiter;
var config = require('./environment').config;

var FeatureManager = exports.FeatureManager = function FeatureManager(rootSuite) {
  this.rootSuite = rootSuite;
  this.features = {};
  this.loaded = [];
  this.pending = [];
};

FeatureManager.prototype.addFeature = function(feature) {
  if (feature.title in this.features) {
    throw Error("There is more than one feature named " + feature.title);
  }
  
  this.features[feature.title] = feature;
  this.length += 1;
};

FeatureManager.prototype._enqueue = function(feature, route) {
  route = route || [];
  
  if (route.indexOf(feature.title) !== -1)
    throw new Error("Can't load features because of circular dependencies: " +
      route.concat(feature.title).join(' -> '));
  
  feature.dependencies.forEach(function(dependency) {
    if (dependency in this.features) {
      this._enqueue(this.features[dependency], route.concat(feature.title));
    } else {
      throw new Error("Can't load feature \"" + feature.title +
        "\" because of unmet dependency: \"" + dependency + '"');
    }
  }.bind(this));
  
  if (this.pending.indexOf(feature.title) === -1)
    this.pending.push(feature.title);
};

FeatureManager.prototype._canLoad = function(feature) {
  for (var i in feature.dependencies) {
    if (this.loaded.indexOf(feature.dependencies[i]) === -1) {
      return false;
    }
  }
  return true;
};

FeatureManager.prototype.loadFeatures = function(featureMatch) {
  var title, feature, prevFeature;
  
  // queue relevant features
  for (title in this.features) {
    var feature = this.features[title];
    if (!featureMatch || title === featureMatch) {
      this._enqueue(feature);
    }
  }
  
  // load the features
  this.pending.forEach(function(title) {
    var feature = this.features[title];
    
    if (prevFeature) {
      // add page to the chain-loading
      prevFeature.on('pageLoaded', feature.loadPage.bind(feature));
    } else {
      feature.loadPage();
    }
    feature.load(this.rootSuite);
    this.loaded.unshift(title);
    prevFeature = feature;
  }.bind(this));
};

var Feature = exports.Feature = function Feature(suite, options, fn) {
  if (!fn) {
    fn = options;
    options = {};
  }
  this.suite = suite;
  this.title = suite.title;
  this.url = options.url || '';
  if (!this.url.match(/^\w+:\/\//))
    this.url = config.baseUrl + this.url;
  this.dependencies = options.dependsOn || [];
  this.fn = fn;
  this.browser = new Browser;
  this.wait = new Waiter(this.browser);
};

Feature.prototype = new EventEmitter;

Feature.prototype.load = function(rootSuite) {
  rootSuite.addSuite(this.suite);
  var self = this;
  this.suite.emit('pre-require', global);
  this.suite.beforeAll(function(done) {
    global.browser = self.browser;
    global.$ = self.browser.query.bind(self.browser);
    global.wait = self.wait;
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

