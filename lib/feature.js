var EventEmitter = require('events').EventEmitter;
var Browser = require('./Browser');
var environment = require('./environment');
var dirname = require('path').dirname;


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
    feature.load(this.rootSuite);
    this.loaded.unshift(title);
    prevFeature = feature;
  }.bind(this));
};

var Feature = exports.Feature = function Feature(suite, options, fn) {
  this.suite = suite;
  this.title = suite.title;
  this.url = options.url || '';
  this.dependencies = options.dependsOn || [];
  this.fn = fn;
  this.file = options.__file;

  // remove cookies when starting a feature in PhantomJS 1.7+
  suite.beforeAll(function() {
    if (phantom.clearCookies) phantom.clearCookies();
  });
};

Feature.prototype = new EventEmitter;

Feature.prototype.load = function(rootSuite) {
  var self = this;
  var context = new Context(this.file);
  rootSuite.addSuite(this.suite);
  this.suite.emit('pre-require', global);
  // TODO: this is a lame start for preloading
  /*var oldBefore = global.before;
  global.before = function(fn) {
    //console.log("preloading for " + self.title);
    var go = false;
    fn(function() {
      go = true;
      //console.log("finished for " + self.title);
    });
    oldBefore(function(done) {
      function check() {
        if (go === true) done();
        else setTimeout(check, 0);
      };
      check();
    });
    global.before = oldBefore;
  };*/
  this.fn.call(context, context, context.browser, context.$);
  this.suite.emit('post-require', global);  
};


function Context(file, name) {
  name = name || 'Context ' + ++Context.n;
  this.__file = file;
  this.browser = new Browser(name);
  this.$ = this.browser.query.bind(this.browser);
  this._includeHelpers(environment.helpers);
  // load feature's own helpers only if file defined (to avoid errors in unit tests)
  if (file) this._includeHelpers(require(file).helpers);
};

Context.n = 0;

Context.prototype.newContext = function(name) {
  return new Context(this.__file, name);
};

Context.prototype.include = function(path) {
  this._includeHelpers(require(dirname(this.__file) + '/' + path).helpers);
  return true;
};

Context.prototype._includeHelpers = function(helpers) {
  for (var helper in helpers) {
    if (helper in this) continue;
    if (helpers[helper] instanceof Function) {
      this[helper] = helpers[helper].bind(this);
    } else {
      this[helper] = helpers[helper];
    }
  }
};
