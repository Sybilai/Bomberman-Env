process.name = "GATEWAY";

process.on('message', function(message) {
  for (var i = 0; i < CLIENTS.length; ++i) {
    if (message.exclude) {
      if ( message.exclude.indexOf(CLIENTS[i].client.id) > -1 )
        continue;
    }

    if (message.only) {
      if ( message.only.indexOf(CLIENTS[i].client.id) < 0 )
        continue;
    }

    CLIENTS[i].sendMessage( message.event );
  }
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

var checkKey = function (data) {
  try {
    data = JSON.parse(data);
  } catch (e) {
    return false;
  }
  return data;
}

sendMessage = function (obj) {
  console.log( JSON.stringify(obj) + '\n' );
  process.send(obj);
}

process.on("exit", function() {
  process.exit(1);
});
