node support/server/app.js &
PID=$!
bin/webspecter
kill -2 $PID

