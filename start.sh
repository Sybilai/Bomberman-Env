#forever stopall
kill -9 $(pidof nodejs)
sleep 1
#forever start main.js
node main.js
