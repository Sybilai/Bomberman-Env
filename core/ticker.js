var Ticker = {
  queue: [],
  update: function() {
    ++GameRules.currentFrame;

    while (Ticker.queue.length) {
      Ticker.queue.shift()();
    }

    Engine.update();
    // if (Draw) Draw.update();

    Message.sendAll();

    setTimeout(Ticker.update, 1000/GameRules.framesPerSecond);
  }
}

module.exports = Ticker;
