const { Command } = require("discord-akairo");
const { MessageEmbed } = require("discord.js");
class QueueCommand extends Command {
  constructor() {
    super("queue", {
      aliases: ["queue"],
      description: "Shows the current queue.",
      clientPermissions: ["SEND_MESSAGES"],
      userPermissions: [],
      cooldown: 5000,
      ratelimit: 1,
      category: "Music",

      args: [
        {
          id: "page",
          type: "number",
          default: null,
        },
      ],
    });
  }

  exec(message, { song }) {
    const player = message.client.manager.players.get(message.guild.id);
    if (!player)
      return message.channel.send("No song is being played in this server.");

    const queue = player.queue;
    const embed = new MessageEmbed().setTitle(
      `Queue for ${message.guild.name}`
    );

    const multiple = 10;
    const page = page && Number(page) ? Number(page) : 1;

    const end = page * multiple;
    const start = end - multiple;

    const tracks = queue.slice(start, end);
    console.log(tracks);

    if (queue.current)
      embed.addField(
        "Current",
        `**[${queue.current.title}](${queue.current.uri})**`
      );

    if (!tracks.length)
      embed.setDescription(
        `No songs in ${page > 1 ? `page ${page}` : "the queue"}.`
      );
    else
      embed.setDescription(
        tracks
          .map((track, i) => `${start + ++i} - [${track.title}](${track.uri})`)
          .join("\n")
      );

    const maxPages = Math.ceil(queue.length / multiple);

    embed.setFooter(`Page ${page > maxPages ? maxPages : page} of ${maxPages}`);
    embed.setColor("RANDOM");
    embed.setAuthor(
      message.author.nickname,
      message.author.displayAvatarURL({ dynamic: true })
    );
    return message.channel.send(embed);
  }
}

module.exports = QueueCommand;
