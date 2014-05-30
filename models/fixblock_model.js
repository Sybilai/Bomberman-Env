var FixBlock = function(_x, _y) {
  this.type = "fixblock";
  this.isBlocking = true;
  this.pos = {
    x: _x,
    y: _y
  }

  Engine.spawn("blocks", _x, _y, this);
};

module.exports = FixBlock;
