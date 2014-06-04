Environment = require('./core/environment.js');
var zlib = require('zlib');

var spawn = require('child_process').spawn
  , fs    = require('fs')
    ;

var GATEWAY_stderr = fs.openSync('./log/gateway_errors.log', 'a'),
    GATEWAY_stdout = fs.openSync('./log/gateway_logs.log', 'a'),
    GATEWAY        = spawn('nodejs',
                           ['./gateway.js'],
                           { detached: true,
                             stdio: ['ipc', GATEWAY_stdout, GATEWAY_stderr]
                           }
                          );

GATEWAY.on('message', function(message) {
  Environment.validating(message);
});

var VISUALIZER_stderr = fs.openSync('./log/visualizer_errors.log', 'a'),
    VISUALIZER_stdout = fs.openSync('./log/visualizer_logs.log', 'a'),
    VISUALIZER        = spawn('nodejs',
                           ['./visualizer.js'],
                           { detached: true,
                             stdio: ['ipc', VISUALIZER_stdout, VISUALIZER_stderr]
                           }
                          );

VISUALIZER.on('message', function(message) {
  VISUALIZER.send({
    only: message,
    event: 'game',
    game_rules: GameRules,
    game_state: Engine.matrices
  });
});


Environment.sendMessage = function(obj) {
  console.log("P:", JSON.stringify(obj));
  obj.event = obj.data.event;
  zlib.gzip(JSON.stringify(obj.data), function(err, buffer) {
    if (!err) {
      obj.data = buffer.toString("base64");
      GATEWAY.send(obj);
    }
  });

  if (!obj.only) {
    VISUALIZER.send(obj.data);
  }
}

Environment.init();

/*
process.once('SIGINT', imDying);
process.once('exit', imDying);

function imDying() {
  GATEWAY.kill("SIGTERM");
  process.exit(0);
}
*/
