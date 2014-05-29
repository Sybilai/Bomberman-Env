Block = require('./../models/block_model.js');
Bomb = require('./../models/bomb_model.js');
Flame = require('./../models/flame_model.js');
Player = require('./../models/player_model.js');
FixBlock = require('./../models/fixblock_model.js');
var Engine = {
  matrices: undefined,
  objects: 0,
  dir: {
    "left": {x: -1, y: 0},
    "right": {x: 1, y: 0},
    "up": {x: 0, y: -1},
    "down": {x: 0, y: 1}
  },

  players: [],
  bombs: [],
  flames: [],

  initMatrices: function(N, M) {
    Engine.matrices = [];

    for (var i = 0; i < N; ++i) {
      Engine.matrices[i] = [];
      for (var j = 0; j < M; ++j) {
        Engine.matrices[i][j] = new Block();
      }
    }

    // border
    for (var i = 0; i < N; ++i) {
      new FixBlock(i, M-1);
      new FixBlock(i, 0);
    }
    for (var i = 0; i < M; ++i) {
      new FixBlock(0, i);
      new FixBlock(N-1, i);
    }
  },

  update: function () {
    if (Engine.players.length) Engine.updatePlayers();
    if (Engine.bombs.length) Engine.updateBombs();
    if (Engine.flames.length) Engine.updateFlames();
  },

  updatePlayers: function() {
    move( "players" );
  },

  updateBombs: function() {
    move( "bombs" );

    for (var i = 0; i < Engine.bombs.length; ++i) {
      var bomb = Engine.bombs[i];
      if (GameRules.currentFrame - bomb.spawnFrame  >= GameRules.bombs.life) {
        bomb.burn();
        --i;
        continue;
      }
    }

  },

  updateFlames: function() {
    for (var i = 0; i < Engine.flames.length; ++i) {
      var flame = Engine.flames[i];
      var ct = Engine.matrices[flame.pos.x][flame.pos.y].content;

      for (var j = 0; j < ct.length; ++j) {
        if (ct[j].mortal === true) {
          if (ct[j].burn) {
            ct[j].burn();
          }
        }
      }

      if (GameRules.currentFrame - flame.spawnFrame >= GameRules.flames.life) {
        spliceContent(flame);
        Engine.flames.splice(i, 1);
        --i;
      }

    }
  },

  createPlayer: function(id, name) {
    // search position start
    var _x, _y;
    while (true) {
      _x = parseInt(Math.random()*1000)%GameRules.sizeN;
      _y = parseInt(Math.random()*1000)%GameRules.sizeM;
      console.log(_x, _y);
      if ( !Engine.matrices[_x][_y].isBlocked() ) break;
    }
    var player = new Player(_x, _y);
    player.id = id;
    player.name = name;
  },

  destroyPlayer: function(id) {
    var aux;
    for (var i = 0, l = Engine.players.length; i < l; ++i) {
      if (Engine.players[i].id == id) {
        aux = Engine.players[i];
        break;
      }
    }

    Engine.destroy("players", aux);
  },

  createBomb: function() {
  },


  spawn: function(key, _x, _y, data) {
    data.object_id = ++Engine.objects;
    Engine.matrices[_x][_y].content.push(data);
    if (Engine[key]) Engine[key].push(data);

    Message.sendSpawn(_x, _y, data);
  },

  destroy: function(key, data) {
    spliceContent( data );
    Engine[key].splice(
      Engine[key].indexOf(data)
      , 1);

    Message.sendDestroy(data.object_id);
  }
}

function spliceContent(x) {
  Engine.matrices[x.pos.x][x.pos.y].content.splice(
    Engine.matrices[x.pos.x][x.pos.y].content.indexOf(x)
  , 1);
}

function move( key ) {
  for (var i = 0, _ilen = Engine[key].length; i < _ilen; ++i) {
    var aux = Engine[key][i];

    if (aux.direction !== "none") {
      var now = GameRules.currentFrame;
      if (now - aux.lastUpdate > GameRules[key].speed) {
        moveThis( aux );
        aux.lastUpdate = now;
      }
    }
  }
}

function moveThis( aux ) {
  var new_pos = {};
  new_pos.x = aux.pos.x + Engine.dir[ aux.direction ].x;
  new_pos.y = aux.pos.y + Engine.dir[ aux.direction ].y;

  switch (Engine.matrices[new_pos.x][new_pos.y].isBlocked()) {
    case "mov":
      if (!aux.isBlocking === false) return;
      if (aux.powerups) {
        if (!aux.powerups.canKick) break;
      }

      for (var i = 0, _ilen = Engine.matrices[new_pos.x][new_pos.y].content.length; i < _ilen; ++i) {
        var el = Engine.matrices[new_pos.x][new_pos.y].content[i];
        if (el.isBlocking === "mov") {
          el.direction = aux.direction;
        }
      }
      break;
    case true:
      aux.direction = "none";
      return;
  }

  spliceContent(aux);
  aux.pos.x = new_pos.x;
  aux.pos.y = new_pos.y;
  Engine.matrices[new_pos.x][new_pos.y].content.push(aux);

}

module.exports = Engine;
