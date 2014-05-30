function Bomb(player_id, _x, _y) {
  this.isBlocking = "mov";
  this.mortal = true;
  this.type = "bomb";
  this.player_id = player_id;
  this.pos = {
    x: _x,
    y: _y
  };
  this.range = GameRules.bombs.range;
  this.spawnFrame = GameRules.currentFrame;
  this.lastUpdate = 0;
  this.direction = "none";

  Engine.spawn("bombs", _x, _y, this);
}

Bomb.prototype.explode =
function() {
  var bomb = this;

  new Flame(bomb.pos);

  function flame(key) {
    for (var i = 1; i <= bomb.range; ++i) {
      var new_pos = {};
      new_pos.x = bomb.pos.x + Engine.dir[key].x * i;
      new_pos.y = bomb.pos.y + Engine.dir[key].y * i;
      if (Engine.matrices[new_pos.x][new_pos.y].isBlocked() === true) {
        break;
      }
      new Flame(new_pos);
    }
  };

  flame("left");
  flame("up");
  flame("down");
  flame("right");
};

Bomb.prototype.burn =
function() {
  Engine.destroy("bombs", this);
  this.explode();
};

module.exports = Bomb;
