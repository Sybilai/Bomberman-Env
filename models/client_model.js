var Client = function(key, client) {
  var self = this;
  this.name = key.name;
  this.token = key.token;
  this.client = client;
  this.is_dead = false;

  client.removeAllListeners("message");
  client.removeAllListeners("end");
  client.removeAllListeners("error");

  client.on("message", function (data) {
    var messages = data.split('\n');
    messages.pop();

    while (messages.length) {
      var message;
      if (message = checkMessage(messages.shift())) {
        if (message.event === "new_player") return;
        if (message.event === "destroy_player") return;
        message.from_id = client.id;
        sendMessage(message);
      } else {
        self.sendMessage({
          event: "error",
          message: "What is that?"
        });
      }
    }
  });

  client.on("close", function () {
    console.log("Client disconnected:", client.id);
    CLIENTS.splice( CLIENTS.indexOf(client), 1);
    self.kill();
  });

  client.on("error", function (exc) {
    console.log("Ignorin exception:", exc);
  });

  this.spawn();
};

Client.prototype.spawn =
function() {
  sendMessage({
    event: "new_player",
    name: this.name,
    from_id: this.client.id
  });
};

Client.prototype.kill =
function() {
  if (this.is_dead) return;
  this.is_dead = true;
  console.log('a intra kill');
  sendMessage({
    event: "destroy_player",
    from_id: this.client.id,
    token: this.token
  });
};

Client.prototype.sendMessage =
function(message) {
  var x = JSON.stringify(message);
  try {
    this.client.send(x + '\n' );
  } catch (e) {
  }
  if (message.event === "game_over") {
    recordScore(this.token, message.bombs, message.kills);
    this.is_dead = true;
    this.client.close();
  }
};

var checkMessage = function (data) {
  console.log(data);
  try {
    data = JSON.parse(data);
  } catch (e) {
    return false;
  }
  return data;
};

var http = require('http');
var recordScore = function (token, bombs, kills) {
  http.request({host: 'sybilai.com',
               path: "/api/new_scoring?token="+token+"&bombs="+bombs+"&kills="+kills}).end();
}

module.exports = Client;
