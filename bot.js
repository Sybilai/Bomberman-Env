var net = require('net'),
    data_center_server_port = 8124;

var lastFrame = Date.now();
var intQ, intV;
function doIt() {
  clearInterval(intQ);
  clearInterval(intV);
  console.log('----------------------------------------------------');
  var socket = net.createConnection( data_center_server_port, "sybilai.com", function() {
      socket.setEncoding('utf8');
      socket.write('{"name": "cezar"}');
      lastFrame = Date.now();
  });


  socket.on( 'data', function(data) {
<<<<<<< Updated upstream
    var now = Date.now();
    console.log((now-lastFrame) + "ms", data);
    lastFrame = now;
=======
    var messages = data.split('\n');
    messages.pop();
    while (messages.length) {
      var message = messages.shift();
      zlib.unzip(new Buffer(message, 'base64'), function(err, buffer) {
        if (!err) {
          console.log(message);
        } else {
          console.log(message, err);
        }
      });
    }
>>>>>>> Stashed changes
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
