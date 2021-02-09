const {
  AkairoClient,
  CommandHandler,
  ListenerHandler,
} = require("discord-akairo");
const { MessageEmbed } = require("discord.js");
const ms = require("ms");
const { join } = require("path");
const { Manager } = require("erela.js");
const Spotify = require("erela.js-spotify");
const { nodes, csID, csSecret, prefix } = require("./config");
const {
  nodeError,
  nodeConnect,
  queueEnd,
  trackStart,
} = require("./player/handleMusic");
const clientID = JSON.stringify(csID);
const clientSecret = JSON.stringify(csSecret);

class MusicV2Client extends AkairoClient {
  constructor(options) {
    super(options);

    this.commandHandler = new CommandHandler(this, {
      prefix: prefix,
      commandUtil: true,
      commandUtilLifetime: 300000,
      handleEdits: true,
      allowMention: true,
      defaultCooldown: 2000,
      automateCategories: true,
      directory: join(__dirname, "commands"),
    });

    this.eventHandler = new ListenerHandler(this, {
      directory: join(__dirname, "events"),
    });

    this.commandHandler.useListenerHandler(this.eventHandler);
    this.commandHandler.loadAll();
    this.eventHandler.loadAll();

    this.manager = new Manager({
      nodes,
      plugins: [
        new Spotify({
          clientID,
          clientSecret,
        }),
      ],
      autoPlay: true,
      send: (id, payload) => {
        const guild = this.guilds.cache.get(id);
        if (guild) guild.shard.send(payload);
      },
    });
    const convertToUnresolved = Spotify.convertToUnresolved;

    Spotify.convertToUnresolved = (track) => {
      const unresolved = convertToUnresolved(track);
      unresolved.uri = track.external_urls.spotify;
      return unresolved;
    };

    this.manager.on("nodeError", (node, error) => {
      nodeError(node, error);
    });
    this.manager.on("nodeConnect", (node) => {
      nodeConnect(node);
    });
    this.manager.on("queueEnd", (player) => {
      queueEnd(this, player);
    });
    this.manager.on("trackStart", (player, track) => {
      trackStart(this, player, track);
    });
    this.manager.on("playerMove", (player, currentChannel, newChannel) => {
      player.voiceChannel = this.channels.cache.get(newChannel);
    });
  }
}

module.exports = MusicV2Client;
