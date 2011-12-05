var utils = require('./utils');
var injectArgs = utils.injectArgs;
var extend = utils.extend;


var prototype = {
  _evaluate: function(fn) {
    return this._page.evaluate(injectArgs({
      id: this._id, query: this._query, n: this._n, fn: fn
    }, function() {
      var element = window._webspecter[$id][$n];
      
      return $fn(element);
    }));
  },

  _event: function(args) {
    return this._evaluate(injectArgs(args, function(element) {
      var e = document.createEvent($eventType);
      $eventInit(e);
      return element.dispatchEvent(e);
    }));
  },

  get text() {
    return this._evaluate(function(element) {
      return element.textContent;
    });
  },

  mouse: function(options) {
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
  },
  
  click: function(button, callback) {
    if (!button || button instanceof Function) {
      callback = button;
      button = 'left';
    }
    var buttonCode = { left: 0 }[button];
    if (typeof buttonCode === 'undefined')
      throw new Error('Wrong mouse button name: ' + button);
      
    this.mouse({ type: 'mousedown', button: buttonCode });
    this.mouse({ type: 'mouseup', button: buttonCode });
    this.mouse({ type: 'click', button: buttonCode });
    
    if (callback) this._browser.onLoaded(callback);
  },
  
  each: function(fn) {
    for (var i=0; i<this.length; ++i) {
      fn(this[i]);
    }
  }
};


var PageQuery = module.exports = function PageQuery(browser, query) {
  this._browser = browser;
  this._query = query;
  this._page = browser.page;
  this._n = 0;
  this._id = this._query + new Date().getTime().toString() + Math.random().toString();
  
  this.length = this._page.evaluate(injectArgs({
    id: this._id, query: this._query
  }, function() {
    window._webspecter = window._webspecter || {};
    var elements = window._webspecter[$id] = document.querySelectorAll($query);
    
    return elements.length;
  }));
  
  if (this.length === 0)
    throw new Error('No element found for "' + query + '"');
  
  for (var i=0; i<this.length; ++i) {
    this[i] = new SubQuery(this, i);
  }
}

PageQuery.prototype = prototype;

var SubQuery = function SubQuery(parent, n) {
  this._browser = parent._browser;
  this._query = parent._query;
  this._page = this._browser.page;
  this._n = n || 0;
  this._id = parent._id;
};

SubQuery.prototype = prototype;

