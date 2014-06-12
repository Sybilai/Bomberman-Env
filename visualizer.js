process.name = "VISUALIZER";

var clients = 0;
var CLIENTS = [];

process.on("message", function(message) {
  for (var i = 0; i < CLIENTS.length; ++i) {
    if (message.only) {
      if ( message.only != CLIENTS[i].id )
        continue;
    }

    CLIENTS[i].send( JSON.stringify(message) + '\n' );
  }
});

var WebSocketServer = require('ws').Server
  , wss = new WebSocketServer({port: 62421});

wss.on('connection', function(ws) {
  ws.id = ++clients;
  CLIENTS.push(ws);

  ws.on("close", function() {
    CLIENTS.splice( CLIENTS.indexOf(ws), 1 );
  });

  process.send(ws.id);
});
