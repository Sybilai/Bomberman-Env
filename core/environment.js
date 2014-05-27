GameRules = require('./game_rules.js');
Engine = require('./engine.js');
var Ticker = require('./ticker.js');

var Environment = {
  init: function() {
    Engine.initMatrices(GameRules.sizeN, GameRules.sizeM);
    Ticker.update();
  },

  validating: function(obj) { // JSON object
    // validating the json
    // if is ok, we will process it
    console.log( obj );
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
