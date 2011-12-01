var utils = require('./utils');
var injectArgs = utils.injectArgs;
var extend = utils.extend;

var PageQuery = module.exports = function PageQuery(browser, query) {
  this._browser = browser;
  this._page = browser.page;
  this._args = {
    query: query
  };
}

PageQuery.prototype = {
  _evaluate: function(fn) {
    return this._page.evaluate(injectArgs(this._args, fn));
  },

  _event: function(args) {
    return this._evaluate(injectArgs(args, function() {
      var element = document.querySelector($query);
      var e = document.createEvent($eventType);
      $eventInit(e);
      return element.dispatchEvent(e);
    }));
  },

  get text() {
    return this._evaluate(function() {
      return document.querySelector($query).textContent;
    });
  },

  mouse: function(options, callback) {
    extend(options, {
      type: 'click',
      detail: 1,
      button: 0
    });
    
    var event = {
      eventType: 'MouseEvents',
      eventInit: injectArgs(options, function(e) {
        e.initMouseEvent($type, true, true, window, $detail, 0, 0, 0, 0, false,
          false, false, false, $button, null);
      })
    };

    this._event(event);
    if (callback) this._browser.onLoad(callback);
  },
  
  click: function(button, callback) {
    if (!button || button instanceof Function) {
      callback = button;
      button = 'left';
    }
    var buttonCode = { left: 0 }[button];
    if (typeof buttonCode === 'undefined')
      throw new Error('Wrong mouse button name: ' + button);
    this.mouse({ type: 'click', button: buttonCode }, callback);
  }
};

