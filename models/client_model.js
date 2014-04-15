var Client = function(key, client) {
  this.name = key.name;
  this.client = client;
  this.is_dead = false;

  client.removeAllListeners("data");
  client.removeAllListeners("end");
  client.removeAllListeners("error");

  client.on("data", function (data) {
    if (data = checkMessage(data)) {
      sendMessage(data);
    }
  });

  client.on("end", function () {
    console.log("Client disconnected:", client.id);
    CLIENTS.splice( CLIENTS.indexOf(this), 1);
    this.isDead();
  });

  client.on("error", function (exc) {
    console.log("Ignorin exception:", exc);
  });

  this.isAlive();
};

Client.prototype.isAlive =
function() {
  sendMessage({
    event: "new_player",
    player: {
      name: this.name,
      player_id: this.client.id
    }
  });
};

Client.prototype.isDead =
function() {
  if (!this.is_dead) return;
  this.is_dead = true;

  sendMessage({
    event: "dead_player",
    player_id: this.client.id
  });
};

Client.prototype.sendMessage =
function(message) {
  Client.client.write( JSON.stringify(message) + '\n' );
};

var checkMessage = function (data) {
  try {
    data = JSON.parse(data);
  } catch (e) {
    return false;
  }
  return data;
};

module.exports = Client;
