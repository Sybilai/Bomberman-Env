var Client = function(key, client) {
  var self = this;
  this.name = key.name;
  this.client = client;
  this.is_dead = false;

  client.removeAllListeners("data");
  client.removeAllListeners("end");
  client.removeAllListeners("error");

  client.on("data", function (data) {
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

  sendMessage({
    event: "destroy_player",
    from_id: this.client.id
  });
};

Client.prototype.sendMessage =
function(message) {
  var x = JSON.stringify(message);
  this.client.write(x.length + x + '\n' );
  if (message.event === "game_over") {
    this.is_dead = true;
    this.client.destroy();
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

module.exports = Client;
