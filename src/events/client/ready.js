const { Listener } = require("discord-akairo");

class ReadyEvent extends Listener {
  constructor() {
    super("ready", {
      emitter: "client",
      event: "ready",
    });
  }

  exec() {
    console.log(`${this.client.user.tag} has logged in.`);
    this.client.manager.init(this.client.user.id);
    this.client.on("raw", (d) => this.client.manager.updateVoiceState(d));
  }
}

module.exports = ReadyEvent;
