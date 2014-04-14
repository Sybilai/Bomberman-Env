GameRules = require('./game_rules.js');
Engine = require('./engine.js');
var Ticker = require('./ticker.js');

var Environment = {
  init: function() {
    var N = 2, M = 2;

    Engine.initMatrices(N, M);
    Ticker.update();
  },

  validating: function(obj) { // JSON object
    // validating the json
    // if is ok, we will process it
    Environment.process(obj);
  },

  process: function(obj) {
    // we will process the obj
  },

  // it gets just one parameter, an obj
  // this is for flexibility and it needs to be declared in main.js
  sendMessage: undefined,

  test: function() {
    Environment.sendMessage({test: 'caca'});
  },
};

module.exports = Environment;
