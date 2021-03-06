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
  Message.sendGameOver( this.id );
};

Player.prototype.bomb =
function() {
  if (Engine.matrices[this.pos.x][this.pos.y].content.length === 1) {
    var bomb = new Bomb(this.id, this.pos.x, this.pos.y);
  }
};

module.exports = Player;
