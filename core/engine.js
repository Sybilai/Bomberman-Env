var http = require('http');
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
    "down": {x: 0, y: 1},
    "none": {x: 0, y: 0}
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

    for (var i = 2; i < N-2; i += 2) {
      for (var j = 2; j < M-2; j += 2) {
        var c = parseInt(Math.random()*1000)%10;
        switch (c%3) {
          case 2:
            break;
          default:
            new FixBlock(i, j);
            break;
        }
      }
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
            if (ct[j].type == "player") {
              if (flame.killed) flame.killed();
            }
            ct[j].burn();
          }
        }
      }

      if (GameRules.currentFrame - flame.spawnFrame >= GameRules.flames.life) {
        Engine.destroy("flames", flame);
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
      if ( !Engine.matrices[_x][_y].isBlocked() ) break;
    }
    var player = new Player(_x, _y);
    player.id = id;
    player.name = name;
  },

  movePlayer: function(id, direction) {
    var player = searchById("players", id);

    if (!player) {
      return;
    }

    for (var i = 0, l = direction.length; i < l; ++i) {
      switch (direction[i]) {
        case "up": break;
        case "down": break;
        case "left": break;
        case "right": break;
        case "none": break;
        default:
          direction.splice(i, 1);
          --i;
          --l;
          break;
      }
    }
    console.log(direction);
    if (direction.length !== 0) {
      player.direction = direction;
    }
  },

  destroyPlayer: function(id, token) {
    var player = searchById("players", id);
    http.request({host: 'sybilai.com',
                  path: "/api/new_scoring?token="+token+"&bombs="+player.bombs+"&kills="+player.kills}).end();

    Engine.destroy("players", player);
  },

  createBomb: function(player_id) {
    var player = searchById("players", player_id);
    player.bomb();
  },


  spawn: function(key, _x, _y, data) {
    data.object_id = ++Engine.objects;
    Engine.matrices[_x][_y].content.push(data);
    if (Engine[key]) Engine[key].push(data);

    Message.sendSpawn(_x, _y, data);
  },

  destroy: function(key, data) {
    if (typeof data === "undefined") return;
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

    if ((typeof aux.direction === "string" && aux.direction !== "none") || (typeof aux.direction === "object" && aux.direction.length > 0)) {
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
  if (typeof aux.direction === "object" && aux.direction.length === 0) return;
  var dir = (typeof aux.direction === "string") ? aux.direction : aux.direction.shift();
  new_pos.x = aux.pos.x + Engine.dir[ dir ].x;
  new_pos.y = aux.pos.y + Engine.dir[ dir ].y;

  switch (Engine.matrices[new_pos.x][new_pos.y].isBlocked()) {
    case "mov":
      if (!aux.isBlocking === false) return;
      if (aux.powerups) {
        if (!aux.powerups.canKick) break;
      }

      for (var i = 0, _ilen = Engine.matrices[new_pos.x][new_pos.y].content.length; i < _ilen; ++i) {
        var el = Engine.matrices[new_pos.x][new_pos.y].content[i];
        if (el.isBlocking === "mov") {
          el.direction = dir;
        }
      }
      break;
    case true:
      aux.direction = "none";
      return;
  }

  Message.sendMove(new_pos.x, new_pos.y, aux.object_id);
  spliceContent(aux);
  aux.pos.x = new_pos.x;
  aux.pos.y = new_pos.y;
  Engine.matrices[new_pos.x][new_pos.y].content.push(aux);
}

function searchById(key, id) {
  for (var i = 0, l = Engine[key].length; i < l; ++i) {
    if (Engine[key][i].id == id) {
      return Engine[key][i];
    }
  }
  return undefined;
}
module.exports = Engine;
