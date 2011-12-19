var extend = require('./utils').extend;

exports.config = {};
exports.global = {};
exports.selectors = {};

exports.load = function(path) {
  if (path) {
    var env = require(path);
    extend(env.config, { baseUrl: '' });
    extend(exports.config, env.config);
    extend(exports.global, env.global);
    extend(exports.selectors, env.selectors);
  }
};
