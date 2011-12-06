var util = require('util');
var utils = require('./utils');
var injectArgs = utils.injectArgs;
var extend = utils.extend;


var queryPrototype = {
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
  
  get value() {
    return this._evaluate(function(element) {
      return element.value;
    });
  },
  
  get checked() {
    return this._evaluate(function(element) {
      return element.checked;
    });
  },
  
  attr: function(name) {
    return this._evaluate(injectArgs({ name: name }, function(element) {
      return element.getAttribute($name);
    }));
  },
  
  fill: function(value) {
    this._evaluate(injectArgs({ value: value }, function(element) {
      element.value = $value;
    }));
  },
  
  check: function() {
    this._evaluate(function(element) {
      element.checked = true;
    });
  },
  
  uncheck: function() {
    this._evaluate(function(element) {
      element.checked = false;
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
    
    if (callback) this._browser.once('loadFinished', callback);
    
    this.mouse({ type: 'mousedown', button: buttonCode });
    this.mouse({ type: 'mouseup', button: buttonCode });
    this.mouse({ type: 'click', button: buttonCode });
  },
  
  each: function(fn) {
    for (var i=0; i<this.length; ++i) {
      fn(this[i]);
    }
  }
};


var PageQuery = module.exports = function PageQuery(browser, query) {
  this._browser = browser;
  if (typeof query === 'string') {
    this._query = query;
    this._type = 'css';
  } else if (query.xpath) {
    this._query = query.xpath;
    this._type = 'xpath';
  } else if (query.text) {
    this._query = '//*[text()="' + query.text + '"]';
    this._type = 'xpath';
  } else if (query.link) {
    this._query = '//a[text()="' + query.link + '"]';
    this._type = 'xpath';
  } else if (query.field) {
    var labelXpath = '//label[normalize-space(text())="' + query.field +
      '" or substring-before(normalize-space(text()), ":")="' + query.field + '"]';
    var forXpath = '//*[@id=' + labelXpath + '/@for]';
    var childXpath = labelXpath + '/*';
    this._query =  forXpath + '|' + childXpath;
    this._type = 'xpath';
  } else if (query.button) {
    var buttonXpath = '//button[text()="' + query.button + '"]';
    var inputXpath = '//input[contains("button,submit,image,reset", @type) and @value="' + query.button + '"]';
    this._query =  buttonXpath + '|' + inputXpath;
    this._type = 'xpath';
  } else {
    throw new Error('Invalid query "' + util.inspect(query) + '"');
  }
  this._page = browser.page;
  this._n = 0;
  this._id = this._query + new Date().getTime().toString() + Math.random().toString();
  
  this.length = this._page.evaluate(injectArgs({
    id: this._id, query: this._query, type: this._type
  }, function() {
    window._webspecter = window._webspecter || {};
    var elements;
    
    if ($type === 'css') {
      elements = document.querySelectorAll($query);
    } else if ($type === 'xpath') {
      elements = [];
      var nodesSnapshot = document.evaluate($query,
        document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      
      for (var i=0; i < nodesSnapshot.snapshotLength; ++i) {  
        elements.push(nodesSnapshot.snapshotItem(i));
      }
    }
    
    window._webspecter[$id] = elements;
    return elements.length;
  }));
  
  if (this.length === 0)
    throw new Error('No element found for "' + util.inspect(query) + '"');
  
  for (var i=0; i<this.length; ++i) {
    this[i] = new SubQuery(this, i);
  }
  this.last = this[this.length - 1];
}

PageQuery.prototype = queryPrototype;

var SubQuery = function SubQuery(parent, n) {
  this._browser = parent._browser;
  this._query = parent._query;
  this._page = this._browser.page;
  this._n = n || 0;
  this._id = parent._id;
};

SubQuery.prototype = queryPrototype;

