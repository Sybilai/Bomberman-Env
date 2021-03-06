process.on('message', function(message) {
  sendToClients(message);
});

function sendToClients(message) {
  for (var i = 0; i < CLIENTS.length; ++i) {
    if (message.exclude) {
      if ( message.exclude.indexOf(CLIENTS[i].client.id) > -1 )
        continue;
    }

    if (message.only) {
      if ( message.only.indexOf(CLIENTS[i].client.id) < 0 )
        continue;
    }

    CLIENTS[i].sendMessage( message.data );
    if (message.event === "game_over") {
      CLIENTS[i].is_dead = true;
      CLIENTS[i].client.destroy();
    }
  }
}

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
      client.write('{"event": "login", "your_id": '+client.id+'}' + '\n');
      CLIENTS.push( new Client(key, client) );
    } else {
      console.log("Invalid key", client.id, data);
      client.destroy();
    }
  });

  client.on("close", function () {
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
  console.log( obj );
  process.send(obj);
}
/*
process.once("exit", function() {
  console.log('what');
  process.exit(1);
});*/
