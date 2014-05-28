Environment = require('./core/environment.js');

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

Environment.sendMessage = function(obj) {
  console.log("P:", JSON.stringify(obj));
  GATEWAY.send(obj);
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
