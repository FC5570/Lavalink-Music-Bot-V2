const Client = require("./src/client");
const config = require("./src/config");

const client = new Client({
  ownerID: config.ownerID,
  disableMentions: "everyone",
});

client.login(config.token);
