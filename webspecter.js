var nodify = 'nodify/nodify.js';
phantom.injectJs(nodify);

var assert, should, feature, browser, query;

nodify.run(function() {
  assert = require('assert');
  should = require('./should');

  var mocha = require('./mocha');
  var suite = new mocha.Suite('');
  var Reporter = require('./mocha/lib/reporters/spec');

  var utils = require('./utils');
  var Browser = require('./Browser');
  require('./patches');

  var path = phantom.args[0] || './test';
  if (path[0] !== '/' && path[0] !== '.') path = './' + path;

  var files = utils.getFiles(path);


  feature = function(name, url, fn) {
    var browser = new Browser;
    browser.get(url);
    describe(name, function() {
      before(function(done) {
        global.browser = browser;
        global.query = browser.query.bind(browser);
        browser.onLoad(done);
      });
      
      fn();
    });
  };
  
  
  var ui = mocha.interfaces['bdd'];
  if (!ui) throw new Error('invalid mocha interface "' + ui + '"');
  ui(suite);
  suite.emit('pre-require', global);
  
  for (var i=0; i<files.length; ++i) {
    suite.emit('pre-require', global, files[i]);
    suite.emit('require', require(files[i]), files[i]);
    suite.emit('post-require', global, files[i]);
    //require(files[i]);
  }

  suite.emit('run');
  var runner = new mocha.Runner(suite);
  runner.on('test', function(newTest) {
    newTest.fn._isTest = true;
  });

  var reporter = new Reporter(runner);
  runner.run();
});

