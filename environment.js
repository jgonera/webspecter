var utils = require('./utils');

exports.config = {};
exports.global = {};

exports.load = function(path) {
  if (path) {
    var env = require(path);
    utils.extend(env.config, { baseUrl: '' });
    utils.extend(exports.config, env.config);
    utils.extend(exports.global, env.global);
  }
};
