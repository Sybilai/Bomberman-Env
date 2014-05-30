var net = require('net'),
    data_center_server_port = 8124;

var lastFrame = Date.now();

var socket = net.createConnection( data_center_server_port, "localhost", function() {
    socket.setEncoding('utf8');
    socket.write('{"name": "cezar"}');
    lastFrame = Date.now();
});


socket.on( 'data', function(data) {
  var now = Date.now();
  console.log((now-lastFrame) + "ms", data);
  lastFrame = now;
}).on('connect', function() {
    console.log('Connected!');
}).on('close', function() {
    console.log('Disconnected!');
});

setTimeout(function() {
  lastFrame = Date.now();
  socket.write('{"event":"bomb"}');
  socket.write('{"event":"move", "direction":["left","right","up","up"]}');
}, 1000);
