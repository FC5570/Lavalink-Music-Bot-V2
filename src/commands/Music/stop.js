const { Command } = require("discord-akairo");

class StopCommand extends Command {
  constructor() {
    super("stop", {
      aliases: ["stop", "dc", "leave"],
      description:
        "Stops the currently playing music and leaves the voice channel.",
      clientPermissions: ["SEND_MESSAGES"],
      userPermissions: [],
      cooldown: 5000,
      ratelimit: 1,
      category: "Music",
    });
  }

  exec(message) {
    const player = message.client.manager.players.get(message.guild.id);
    if (!player)
      return message.channel.send(
        "No song is being currently played in this server."
      );
    g;
    const { channel } = message.member.voice;

    if (!channel)
      return message.channel.send("You need to join a voice channel.");
    if (channel.id !== player.voiceChannel)
      return message.channel.send("You're not in the same voice channel.");

    player.destroy();
    return message.channel.send("Music has been stopped.");
  }
}

module.exports = StopCommand;
