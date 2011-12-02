var express = require('express');
var app = express.createServer();

app.use(express.static(__dirname + '/static'));
app.register('.html', require('ejs'));
app.set('view engine', 'html');

app.get('/', function(req, res) {
  res.render('index');
});

app.get('/test', function(req, res) {
  res.send('hello');
});

app.listen(4567);
console.log("Express server listening on port %d", app.address().port);
