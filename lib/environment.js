var extend = require('./utils').extend;

exports.config = {};
exports.helpers = {};
exports.selectors = {};

exports.load = function(path) {
  if (path) {
    var env = require(path);
    extend(env.config, { baseUrl: '' });
    extend(exports.config, env.config);
    extend(exports.helpers, env.helpers);
    extend(exports.selectors, env.selectors);
  }
};
