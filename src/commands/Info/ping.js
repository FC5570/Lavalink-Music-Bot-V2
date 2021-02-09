const { Command } = require("discord-akairo");

class PingCommand extends Command {
  constructor() {
    super("ping", {
      aliases: ["ping", "pong", "ding", "dong"],
      description: "Displays the bots ping",
      clientPermissions: ["SEND_MESSAGES"],
      userPermissions: [],
      cooldown: 5000,
      ratelimit: 1,
      category: "Info",
    });
  }

  exec(message) {
    message.channel.send(`Pong!\n${this.client.ws.ping} ms`);
  }
}

module.exports = PingCommand;
