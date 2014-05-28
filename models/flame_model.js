function Flame(pos) {
  this.isBlocking = false;
  this.type = "flame";
  this.pos = {
    x: pos.x,
    y: pos.y
  };
  this.spawnFrame = GameRules.currentFrame;

  Engine.spawn("flames", pos.x, pos.y, this);
}

module.exports = Flame;
