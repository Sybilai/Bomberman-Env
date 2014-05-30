var GameRules = {
  sizeN: 20,
  sizeM: 15,


  bombs: {
    life: 24, //frames
    range: 1,  //blocks
    speed: 2  //frames/block
  },

  flames: {
    life: 12  //frames
  },

  players: {
    speed: 4  //frames/block
  },

  currentFrame: 0,
  framesPerSecond: 10
};

module.exports = GameRules;
