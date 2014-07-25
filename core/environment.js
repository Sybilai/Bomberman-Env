GameRules = require('./game_rules.js');
Engine = require('./engine.js');
Message = require('./message.js');
var Ticker = require('./ticker.js');

var Environment = {
  init: function() {
    Engine.initMatrices(GameRules.sizeN, GameRules.sizeM);
    Ticker.update();
  },

  validating: function(obj) { // JSON object
    // validating the json
    // if is ok, we will process it
    console.log(obj);
    Environment.process(obj);
  },

  process: function(obj) {
    // we will process the obj
    switch (obj.event) {
      case 'game_state':
        Message.baseQueue.push( (function(obj) {
          return function() {
            Message.sendGameState(obj.from_id);
          }
        })(obj) );
        break;

      case 'game_rules':
        Message.sendGameRules(obj.from_id);
        break;

      case 'new_player':
        Ticker.queue.push( (function(obj) {
          return function() {
            Engine.createPlayer(obj.from_id, obj.name);
            Message.sendGameRules(obj.from_id);
            Message.baseQueue.push( (function(obj) {
              return function() {
                Message.sendGameState(obj.from_id);
              }
            })(obj) );
          }
        })(obj) );
        break;

      case 'destroy_player':
        Ticker.queue.push( (function(from_id, token) {
          return function() {
            console.log("avem si token", token);
            Engine.destroyPlayer(from_id, token);
          }
        })(obj.from_id, obj.token) );
        break;

      case 'move':
        if( Object.prototype.toString.call( obj.direction ) === '[object Array]' ) {
          Ticker.queue.push( (function(from_id, direction) {
            return function() {
              Engine.movePlayer(from_id, direction);
            }
          })(obj.from_id, obj.direction) );
        } else {
          Message.send(obj, "Direction should be array");
        }
        break;

      case 'bomb':
        Ticker.queue.push( (function(from_id) {
          return function() {
            Engine.createBomb(from_id);
          }
        })(obj.from_id) );
        break;
      default:
        Message.send(obj, "This is not a valid event");
        break;
    }
  },

  // it gets just one parameter, an obj
  // this is for flexibility and it needs to be declared in main.js
  sendMessage: undefined,

  test: function() {
    Environment.sendMessage({test: 'caca'});
  },
};

module.exports = Environment;
