var net = require('net'),
    data_center_server_port = 8124;
var zlib = require('zlib');

var lastFrame = Date.now();
var intQ, intV;
function doIt() {
  clearInterval(intQ);
  clearInterval(intV);
  console.log('----------------------------------------------------');
  var socket = net.createConnection( data_center_server_port, "localhost", function() {
      socket.setEncoding('utf8');
      socket.write('{"name": "cezar"}');
      lastFrame = Date.now();
  });


  socket.on( 'data', function(data) {
    var messages = data.split('\n');
    messages.pop();
    while (messages.length) {
      var message = messages.shift();
      zlib.unzip(new Buffer(message, 'base64'), function(err, buffer) {
        if (!err) {
          console.log(JSON.parse(buffer.toString()).event);
        } else {
         // console.log(message, err);
        }
      });
    }
  }).on('connect', function() {
      console.log('Connected!');
  }).on('close', function() {
      console.log('Disconnected!');
      doIt();
  }).on('error', function() {
      console.log('err');
  });
  socket.on('connect', function() {
    var q = function() {
      socket.write('{"event":"move", "direction":["left","right","up","left", "up", "up", "right"]}' + '\n');
    };
    q();
    intQ = setInterval(q, 4000);
    intV = setInterval(function() {
      socket.write('{"event":"bomb"}' + '\n');
    }, 2000);
  });
};

doIt();
