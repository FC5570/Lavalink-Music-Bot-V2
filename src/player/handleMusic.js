const { MessageEmbed } = require("discord.js");

module.exports = {
  nodeError(node, error) {
    console.log(`Lavalink error: ${error.stack}`);
  },
  nodeConnect(node) {
    console.log(`Connected to ${node.options.host}`);
  },
  queueEnd(client, player) {
    const embed = new MessageEmbed()
      .setDescription("Queue ended. :wave:")
      .setColor("RANDOM");
    client.guilds.cache
      .get(player.guild)
      .channels.cache.get(player.textChannel)
      .send(embed);
    return player.destroy();
  },

  trackStart(client, player, track) {
    const channel = client.channels.cache.get(player.textChannel);
    let min = Math.floor((track.duration / 1000 / 60) << 0),
      sec = Math.floor((track.duration / 1000) % 60);
    let sec2;
    if (sec < 10) {
      sec2 = `0${sec}`;
    } else {
      sec2 = sec;
    }
    let np = new MessageEmbed()
      .setColor("RANDOM")
      .setDescription(
        `**Now playing:** \n\**[${track.title}](${track.uri})**\nRquested by: **${track.requester.tag}** \nDuration: \`${min}:${sec2}\`\nArtist: \`${track.author}\``
      )
      .setThumbnail(track.thumbnail);
    channel.send(np).then((m) => m.delete({ timeout: track.duration }));
  },
};
