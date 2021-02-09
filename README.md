# Lavalink-Music-Bot-V2

A Lavalink Music Bot which uses erela.js and discord-akairo.

## Configuration
1) Make a new Discord Application on the developer portal.
2) Fill the `config.js` file in `src` folder (more info below)
3) After you're done with the config, install the packages using `npm i`.
4) Start the bot using `node index.js`

## Config
1) **token**: Your Discord Bot Token found in the Bot tab of your Application.
2) **prefix**: The Bot's prefix.
3) **nodes**: An array of lavalink nodes to be used to play music. `host` is the lavalink host (localhost if youre running it locally), `port` is the Lavalink Server port (default is 2333), `password` is the Lavalink Server Password (default is youshallnotpass).
