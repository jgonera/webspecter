cd support/server
npm install
node app.js &
cd ../..
PID=$!
bin/webspecter
kill -2 $PID

