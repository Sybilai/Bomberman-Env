function Player(_x, _y) {
  this.isBlocking = false;
  this.mortal = true;
  this.type = "player";

  this.pos = {
    x: _x,
    y: _y
  };

  this.powerups = {
    canKick: true
  };

  this.name = "Barman";
  this.lastUpdate = 0;
  this.direction = "none";

  Engine.spawn("players", _x, _y, this);
}

Player.prototype.burn =
function() {
  Engine.destroy("players", this);
};

module.exports = Player;
