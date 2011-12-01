phantom.injectJs('../_nodify.js'); // TODO: remove when PhantomJS has full module support

var fs = require('fs');
var utils = require('./utils');

var files = utils.getFiles('./mocha/lib');
var i, file, path, content, newContent;

for (i=0; i<files.length; ++i) {
  path = files[i];
  file = fs.open(path, 'r');
  content = file.read();
  file.close();
  newContent = parseInheritance(content);
  file = fs.open(path, 'w');
  file.write(newContent);
  file.close();
}

phantom.exit();

/**
 * Parse __proto__.
 */

function parseInheritance(js) {
  return js
    .replace(/^ *(\w+)\.prototype\.__proto__ * = *(\w+)\.prototype *;?/gm, function(_, child, parent){
      return child + '.prototype = new ' + parent + ';\n'
        + child + '.prototype.constructor = '+ child + ';\n';
    });
}

