const { Command } = require("discord-akairo");

class PauseCommand extends Command {
  constructor() {
    super("pause", {
      aliases: ["pause"],
      description: "Pauses the currently playing music.",
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
      return message.channel.send("No song is being played in this server.");

    const { channel } = message.member.voice;

    if (!channel)
      return message.channel.send("You need to join a voice channel.");
    if (channel.id !== player.voiceChannel)
      return message.channel.send("You're not in the same voice channel.");
    if (player.paused) return message.channel.send("Music is already paused.");

    player.pause(true);
    return message.channel.send("Muisc has been paused.");
  }
}

module.exports = PauseCommand;
