app = require('express').createServer()

app.get '/', (req, res) ->
  res.send('Hello World')

app.listen(4567)
console.log "Express server listening on port %d", app.address().port
