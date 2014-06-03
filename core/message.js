var Message = {
  queue: [],
  baseQueue: [],
  send: function(obj, mess) {
    this.queue.push({
      only: [obj.from_id],
      data: {
        event: "error",
        message: mess,
        data: JSON.stringify(obj)
      }
    });
  },

  sendGameRules: function(to_id) {
    this.queue.push({
      only: [to_id],
      data: {
        event: "game_rules",
        data: GameRules
      }
    });
  },

  sendGameState: function(to_id) {
    this.queue.push({
      only: [to_id],
      data: {
        event: "game_state",
        data: Engine.matrices
      }
    });
  },

  sendSpawn: function(_x, _y, what) {
    this.queue.push({
      data: {
        event: "new_entity",
        x: _x,
        y: _y,
        data: what
      }
    });
  },

  sendDestroy: function( object_id ) {
    this.queue.push({
      data: {
        event: "destroy_entity",
        object_id: object_id
      }
    });
  },

  sendMove: function( _x, _y, object_id ) {
    this.queue.push({
      data: {
        event: "move_entity",
        x: _x,
        y: _y,
        object_id: object_id
      }
    });
  },

  sendGameOver: function( to_id ) {
    this.queue.push({
      only: [to_id],
      data: {
        event: "game_over"
      }
    });
  },

  sendAll: function() {
    var frame = [];
    while (this.baseQueue.length) {
      this.baseQueue.shift()();
    }

    while (this.queue.length) {
      var aux = this.queue.shift();
      if (aux.only) {
        aux.data.timestamp = GameRules.currentFrame;
        Environment.sendMessage(aux);
      } else {
        frame.push(aux.data);
      }
    }
    if (frame.length) {
      Environment.sendMessage({
        data: {
          event: "frame",
          frame: frame,
          timestamp: GameRules.currentFrame
        }
      });
    }
  }
};

module.exports = Message;
