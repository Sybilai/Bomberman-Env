var GameRules = {
  sizeN: 10,
  sizeM: 15,


  speed: {           // frames/block
    players: 20,
    bombs: 10
  },

  bombs: {
    life: 120, //frames
    range: 1,  //blocks
    speed: 10  //frames/block
  },

  flames: {
    life: 60   //frames
  },

  players: {
    speed: 20  //frames/block
  },

  currentFrame: 0,
  framesPerSecond: 1
};

module.exports = GameRules;
