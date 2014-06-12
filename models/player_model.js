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

  this.lastUpdate = 0;
  this.direction = "none";
  this.bombs = 0;
  this.kills = 0;
  Engine.spawn("players", _x, _y, this);
}

Player.prototype.burn =
function() {
  Engine.destroy("players", this);
  Message.sendGameOver( this.id, this.bombs, this.kills );
};

Player.prototype.bomb =
function() {
  if (Engine.matrices[this.pos.x][this.pos.y].content.length === 1) {
    ++this.bombs;
    var bomb = new Bomb(this.id, this.pos.x, this.pos.y);
    var self = this;
    bomb.killed = function() {
      ++self.kills;
    }
  }
};

module.exports = Player;
