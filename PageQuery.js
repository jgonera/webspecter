var util = require('util');
var utils = require('./utils');
var injectArgs = utils.injectArgs;
var extend = utils.extend;
var env = require('./environment');


var QueryBase = function() {};

QueryBase.prototype = {
  _evaluate: function() {
    var args = Array.prototype.slice.call(arguments);

    function wrapper(id, n) {
      var args = Array.prototype.slice.call(arguments, 2);
      var fn = args.pop();
      var element = window._webspecter[id][n];
      args.unshift(element);
      return fn.apply(this, args);
    }

    args.push(wrapper);
    args.unshift(this._n);
    args.unshift(this._id);
    return this._browser.evaluate.apply(this._browser, args);
  },
  
  get present() {
    return this.length !== 0;
  },
  
  get visible() {
    return this._evaluate(function(element) {
      var el = element;
      while (el) {
        var style = window.getComputedStyle(el, null);
        if (style.display === 'none' || style.visibility === 'hidden') {
          return false;
        }
        el = el.parentElement;
      }
      return true;
    });
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
  
  get is() {
    var self = this;
    var is = {
      // requery for `present` instead of using the current query
      present: function() {
        return new PageQuery(self._browser, self._queryObj).present;
      }
    };
    
    ['visible', 'checked'].forEach(function(property) {
      is[property] = function() {
        return self[property];
      };
    });
    return is;
  },
  
  get checked() {
    return this._evaluate(function(element) {
      return element.checked;
    });
  },
  
  attr: function(name) {
    return this._evaluate(name, function(element, name) {
      return element.getAttribute(name);
    });
  },
  
  fill: function(value) {
    this._evaluate(value, function(element, value) {
      element.value = value;
    });
  },

  type: function(text) {
    this._evaluate(text, function(element, text) {
      var e = document.createEvent('TextEvent');
      e.initTextEvent('textInput', true, true, window, text);
      return element.dispatchEvent(e);
    });
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

  select: function(option) {
    this._evaluate(option, function(element, option) {
      for (var i=0; i < element.options.length; ++i) {
        if (element.options[i].textContent === option) {
          element.selectedIndex = i;
          break;
        }
      }
    });
  },

  mouseEvent: function(options) {
    extend(options, {
      type: 'click',
      detail: 1,
      button: 0
    });

    this._evaluate(
      options.type, options.detail, options.button,
      function(element, type, detail, button) {
        var e = document.createEvent('MouseEvents');
        e.initMouseEvent(type, true, true, window, detail, 0, 0, 0, 0, false,
          false, false, false, button, null);
        return element.dispatchEvent(e);
      }
    );
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
    
    this.mouseEvent({ type: 'mousedown', button: buttonCode });
    this.mouseEvent({ type: 'mouseup', button: buttonCode });
    this.mouseEvent({ type: 'click', button: buttonCode });
  },
  
  each: function(fn) {
    for (var i=0; i<this.length; ++i) {
      fn(this[i]);
    }
  }
};


var PageQuery = module.exports = function PageQuery(browser, query) {
  extend(this._selectors, env.selectors);
  this._browser = browser;
  this._queryObj = query;
  this._parseQuery();
  this._n = 0;
  this._id = this._query + new Date().getTime().toString() + Math.random().toString();
  
  this._evaluateQuery();
  
  if (this.length === 0) {
    this._nullifyProperties();
  } else {
    this._addSubqueries();
  }
}

PageQuery.prototype = new QueryBase;

PageQuery.prototype._selectors = {
  text: function(query) {
    return { xpath: '//*[text()="' + query + '"]' };
  },
  link: function(query) {
    return { xpath: '//a[text()="' + query + '"]' };
  },
  field: function(query) {
    var labelXpath = '//label[normalize-space(text())="' + query +
      '" or substring-before(normalize-space(text()), ":")="' + query + '"]';
    var forXpath = '//*[@id=' + labelXpath + '/@for]';
    var childXpath = labelXpath + '/*';
    return { xpath: forXpath + '|' + childXpath };
  },
  button: function(query) {
    var buttonXpath = '//button[text()="' + query + '"]';
    var inputXpath = '//input[contains("button,submit,image,reset", @type) and @value="' + query + '"]';
    return { xpath: buttonXpath + '|' + inputXpath };
  }
};

PageQuery.prototype._parseQuery = function() {
  var query = this._queryObj;
  if (typeof query === 'string') {
    this._query = query;
    this._type = 'css';
  } else if (query.xpath) {
    this._query = query.xpath;
    this._type = 'xpath';
  } else {
    var selector;
    for (selector in query) break;
    if (selector in this._selectors) {
      this._queryObj = this._selectors[selector](query[selector]);
      this._parseQuery();
    } else {
      throw new Error('Invalid query "' + util.inspect(query) + '"');
    }
  }
};

PageQuery.prototype._evaluateQuery = function() {
  this.length = this._browser.evaluate(this._id, this._query, this._type, function(id, query, type) {
    window._webspecter = window._webspecter || {};
    var elements;
    
    if (type === 'css') {
      elements = document.querySelectorAll(query);
    } else if (type === 'xpath') {
      elements = [];
      var nodesSnapshot = document.evaluate(query,
        document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      
      for (var i=0; i < nodesSnapshot.snapshotLength; ++i) {  
        elements.push(nodesSnapshot.snapshotItem(i));
      }
    }
    
    window._webspecter[id] = elements;
    return elements.length;
  });
};

PageQuery.prototype._nullifyProperties = function() {
  var throwNotFound = function() {
    throw new Error('No element found for ' + util.inspect(this._queryObj) +
                    ' in\n' + this._browser.page.content);
  };
  var nullProperties = {};
  for (var key in this) {
    if (key[0] !== '_' && key !== 'length' && key !== 'present' && key !== 'is') {
      nullProperties[key] = { get: throwNotFound };
    }
  }
  Object.defineProperties(this, nullProperties);
};

PageQuery.prototype._addSubqueries = function() {
  for (var i=0; i<this.length; ++i) {
    this[i] = new SubQuery(this, i);
  }
  this.last = this[this.length - 1];
};


var SubQuery = function SubQuery(parent, n) {
  this._browser = parent._browser;
  this._query = parent._query;
  this._n = n || parent._n;
  this._id = parent._id;
};

SubQuery.prototype = new QueryBase;

