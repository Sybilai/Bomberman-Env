var Client = function(key, client) {
  var self = this;
  this.name = key.name;
  this.client = client;
  this.is_dead = false;

  client.removeAllListeners("data");
  client.removeAllListeners("end");
  client.removeAllListeners("error");

  client.on("data", function (data) {
    if (data = checkMessage(data)) {
      data.from_id = client.id;
      sendMessage(data);
    }
  });

  client.on("end", function () {
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
  if (!this.is_dead) return;
  this.is_dead = true;

  sendMessage({
    event: "destroy_player",
    from_id: this.client.id
  });
};

Client.prototype.sendMessage =
function(message) {
  this.client.write( JSON.stringify(message) + '\n' );
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
