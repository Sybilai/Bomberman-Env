var FixBlock = function(_x, _y) {
  this.type = "fixblock";
  this.isBlocking = true;

  Engine.spawn("blocks", _x, _y, this);
};

module.exports = FixBlock;
