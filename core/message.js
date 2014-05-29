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

  sendAll: function() {
    while (this.baseQueue.length) {
      this.baseQueue.shift()();
    }
    while (this.queue.length) {
      var aux = this.queue.shift();
      aux.timestamp = GameRules.currentFrame;
      Environment.sendMessage(aux);
    }
  }
};

module.exports = Message;