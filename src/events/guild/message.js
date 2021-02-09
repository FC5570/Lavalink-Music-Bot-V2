const { Listener } = require("discord-akairo");
const { MessageEmbed } = require("discord.js");

class MessageEvent extends Listener {
  constructor() {
    super("message", {
      emitter: "client",
      event: "message",
    });
  }

  exec(message) {
    if (
      message.content === `<@${this.client.user.id}>` ||
      message.content === `<@!${this.client.user.id}>`
    ) {
      const embed = new MessageEmbed()
        .setTitle("Pong, looks like you need help")
        .setDescription(
          `My prefix is **${this.client.commandHandler.prefix}**, use \`${this.client.commandHandler.prefix}help\` to see my commands. You can also use the help command along with the name of the command to get info on a specific command.\nThis bot is [open-source](https://github.com/FC5570/Lavalink-Music-Bot-V2), leave a star if you liked it. Contributions are appreciated.`
        )
        .setColor("RANDOM")
        .setAuthor(
          message.author.username,
          message.author.displayAvatarURL({ dynamic: true })
        );
      message.channel.send(embed);
    }
  }
}

module.exports = MessageEvent;
