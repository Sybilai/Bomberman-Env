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

  sendGameState: function(to_id) {
    this.queue.push({
      only: [to_id],
      data: {
        event: "game_state",
        data: Engine.matrices
      }
    });
  },

  sendAll: function() {
    while (this.baseQueue.length) {
      this.baseQueue.shift()();
    }
    while (this.queue.length) {
      Environment.sendMessage(this.queue.shift());
    }
  }
};

module.exports = Message;
