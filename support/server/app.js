var express = require('express');
var app = express.createServer();

app.configure(function() {
  app.use(express.static(__dirname + '/static'));
  app.use(express.bodyParser());
  app.register('.html', require('ejs'));
  app.set('view engine', 'html');
  app.set('views', __dirname + '/views');
});

app.get('/', function(req, res) {
  res.render('index');
});

app.get('/subpage', function(req, res) {
  res.render('subpage');
});

app.post('/post', function(req, res) {
  res.render('post', req.body);
});

app.listen(4567);
console.log("Express server listening on port %d", app.address().port);
