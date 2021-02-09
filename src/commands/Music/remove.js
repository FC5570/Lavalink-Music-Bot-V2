const { Command } = require("discord-akairo");

class RemoveCommand extends Command {
  constructor() {
    super("remove", {
      aliases: ["remove"],
      description: "Removes a song from the queue.",
      clientPermissions: ["SEND_MESSAGES"],
      userPermissions: [],
      cooldown: 5000,
      ratelimit: 1,
      category: "Music",

      args: [
        {
          id: "song",
          type: "number",
        },
      ],
    });
  }

  exec(message, { song }) {
    const player = message.client.manager.players.get(message.guild.id);
    if (isNaN(song))
      return message.channel.send("Song position should be a number.");

    if (song == 0)
      return message.channel.send(
        "Can't remove a song that is already playing."
      );

    if (song > player.queue.length)
      return message.channel.send("Couldn't find that song");

    const { title } = player.queue[args[0] - 1];

    player.queue.splice(args[0] - 1, 1);
    return message.channel.send(`Removed ***${title}*** from the queue`);
  }
}

module.exports = RemoveCommand;
