var Ticker = {
  queue: [],
  update: function() {
    console.log(GameRules.framesPerSecond);
    ++GameRules.currentFrame;

    while (Ticker.queue.length) {
      Ticker.queue.shift()();
    }

    Engine.update();
    // if (Draw) Draw.update();

    setTimeout(Ticker.update, 1000/GameRules.framesPerSecond);
  }
}

module.exports = Ticker;
