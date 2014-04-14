process.name = "GATEWAY";

process.on('message', function(message) {
  console.log( message );
});

var Client = require('./models/client_model.js');
CLIENTS = [];

var server_port = 8124
  , net = require('net')
  , encoding = "utf8"

  , counter_clients = 0
  ;

var server = net.createServer( function (client) {

  client.setEncoding( encoding );
  client.id = ++counter_clients;

  console.log("Connected:", client.id);

  client.on("data", function (data) {
    var key;
    if ( key = checkKey(data) ) {
      console.log("Valid key", client.id, data);
      CLIENTS.push( new Client(key, client) );
    } else {
      console.log("Invalid key", client.id, data);
      client.destroy();
    }
  });

  client.on("end", function () {
    console.log("Client disconnected:", client.id);
  });

  client.on("error", function (exc) {
    console.log("Ignoring exception:", exc);
  });

}).listen(server_port);

function checkKey(data) {
  try {
    data = JSON.parse(data);
  } catch (e) {
    return false;
  }
  return data;
}
