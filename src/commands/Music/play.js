const { Command } = require("discord-akairo");
const { MessageEmbed } = require("discord.js");

class PlayCommand extends Command {
  constructor() {
    super("play", {
      aliases: ["play", "p"],
      description: "Plays music",
      clientPermissions: ["CONNECT", "SPEAK", "EMBED_LINKS", "SEND_MESSAGES"],
      userPermissions: [],
      category: "Music",
      cooldown: 5000,
      ratelimit: 1,

      args: [
        {
          id: "song",
          type: "string",
        },
      ],
    });
  }

  async exec(message, { song }) {
    const { channel } = message.member.voice;
    if (!channel)
      return message.channel.send(":x: | You need to join a voice channel.");
    if (!song)
      return message.channel.send(
        ":x: | You need to give me a URL or a search term."
      );

    const player = this.client.manager.create({
      guild: message.guild.id,
      voiceChannel: channel.id,
      textChannel: message.channel.id,
      volume: 100,
      selfDeafen: true,
    });
    player.connect();

    const search = song;
    let res;

    try {
      res = await player.search(search, message.author);
      if (res.loadType === "LOAD_FAILED") {
        if (!player.queue.current) player.destroy();
        throw new Error(res.exception.message);
      }
    } catch (err) {
      console.log(err.stack);
      return message.channel.send(
        `:x: | There was an error while searching: ${err.message}`
      );
    }
    switch (res.loadType) {
      case "NO_MATCHES":
        if (!player.queue.current) player.destroy();
        return message.channel.send(":x: | No results were found.");

      case "TRACK_LOADED":
        player.queue.add(res.tracks[0]);
        if (!player.playing && !player.paused && !player.queue.length)
          player.play();
        return message.channel.send(
          `:white_check_mark: | **Enqueuing** \`${res.tracks[0].title}\`.`
        );

      case "PLAYLIST_LOADED":
        player.queue.add(res.tracks);
        player.play();
        return message.channel.send(
          `:white_check_mark: | **Enqueuing playlist**: \n **${res.playlist.name}** : **${res.tracks.length} tracks**`
        );

      case "SEARCH_RESULT":
        let max = 10,
          collected,
          filter = (m) =>
            m.author.id === message.author.id && /^(\d+|end)$/i.test(m.content);
        if (res.tracks.length < max) max = res.tracks.length;
        const results = res.tracks
          .slice(0, max)
          .map((track, index) => `${++index} - \`${track.title}\``)
          .join("\n");

        const resultss = new MessageEmbed()
          .setTitle(
            "Select a song to play and send the number next to it. You have 30 seconds to select."
          )
          .setDescription(results)
          .setColor("RANDOM")
          .setFooter(`Use "end" to cancel`);
        message.channel.send(resultss);
        try {
          collected = await message.channel.awaitMessages(filter, {
            max: 1,
            time: 30e3,
            errors: ["time"],
          });
        } catch (e) {
          if (!player.queue.current) player.destroy();
          return message.channel.send(
            ":x: | You didn't provide a selection in time."
          );
        }
        const first = collected.first().content;
        if (first.toLowerCase() === "end") {
          if (!player.queue.current) player.destroy();
          return message.channel.send(
            ":white_check_mark: | Cancelled selection."
          );
        }
        const index = Number(first) - 1;
        if (index < 0 || index > max - 1)
          return message.channel.send(
            `:x: | The number you provided is too small or too big (1-${max}).`
          );
        const track = res.tracks[index];
        player.queue.add(track);
        if (!player.playing && !player.paused && !player.queue.length)
          player.play();
        return message.channel.send(
          `:white_check_mark: | **Enqueuing:** \`${track.title}\`.`
        );
    }
  }
}

module.exports = PlayCommand;
