var Waiter = exports.Waiter = function Waiter(browser) {
  this._browser = browser;
};

Waiter.prototype.until = function(conditionFn, fn) {
  var self = this;
  if (conditionFn()) {
    fn();
  } else {
    setTimeout(function() { self.until(conditionFn, fn); }, 0);
  }
};

Waiter.prototype['for'] = Waiter.prototype.until;

Waiter.prototype['while'] = function(conditionFn, fn) {
  var self = this;
  if (!conditionFn()) {
    fn();
  } else {
    setTimeout(function() { self['while'](conditionFn, fn); }, 0);
  }
};

Waiter.prototype.untilExists = function(query, fn) {
  var self = this;
  this.until(function() {
    return self._browser.query(query).exists;
  }, fn);
};

Waiter.prototype.whileExists = function(query, fn) {
  var self = this;
  this['while'](function() {
    return self._browser.query(query).exists;
  }, fn);
};
