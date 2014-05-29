var GameRules = {
  sizeN: 10,
  sizeM: 15,


  bombs: {
    life: 120, //frames
    range: 1,  //blocks
    speed: 2  //frames/block
  },

  flames: {
    life: 60   //frames
  },

  players: {
    speed: 4  //frames/block
  },

  currentFrame: 0,
  framesPerSecond: 10
};

module.exports = GameRules;
