Environment = require('./environment.js');

var spawn = require('child_process').spawn,
    fs    = require('fs')
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
  GATEWAY.send(obj);
}

Environment.test();

/*
var VISUALIZER_stderr = fs.openSync('./log/visualizer_errors.log', 'a'),
    VISUALIZER_stdout = fs.openSync('./log/visualizer_logs.log', 'a'),
    VISUALIZER        = spawn('nodejs', 
                              ['./visualizer.js'],
                              { detached: true,
                                stdio: ['ipc', GATEWAY_stdout, GATEWAY_stderr] 
                              }
                             );

VISUALIZER.on('message', function(message) {
  console.log('message:', message);
});
*/
