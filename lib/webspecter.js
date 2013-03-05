#!/usr/bin/env phantomjs
require('../nodify');

require('./patches');
var utils = require('./utils');
var Engine = require('./engine').Engine;
var program = require('commander');

program.name = 'webspecter';
program
.version('0.1.0dev')
.description('webspecter')
.usage('[options] test_dir')
.option('-f, --feature <title>', 'title of the feature to be tested', null)
.option('-c, --console', 'forward JavaScript console to stderr')
.option('-t, --timeout', 'set timeout of individual tests')
.option('-R, --reporter <name>', 'specify the reporter to use', null)
.option('--reporters', 'display available reporters')
.parse(process.argv);

if (program.reporters) {
  console.log();
  console.log(' dot - dot matrix');
  console.log(' doc - html documentation');
  console.log(' spec - hierarchical spec list');
  console.log(' json - single json object');
  console.log(' progress - progress bar');
  console.log(' list - spec-style listing');
  console.log(' tap - test-anything-protocol');
  console.log(' landing - unicode landing strip');
  console.log(' xunit - xunit reportert');
  console.log(' teamcity - teamcity ci support');
  console.log(' html-cov - HTML test coverage');
  console.log(' json-cov - JSON test coverage');
  console.log(' min - minimal reporter (great with --watch)');
  console.log(' json-stream - newline delimited json events');
  console.log(' markdown - markdown documentation (github flavour)');
  console.log();
  process.exit();
}

program.path = utils.getPath(program.args[0]);

var engine = new Engine(program);
engine.run();

