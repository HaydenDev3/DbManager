require('dotenv').config();
const Discord = require("discord.js");
const bot = new Discord.Client({ intents: 14023 }); // the client.
const Enmap = require("enmap");
const fs = require('fs');

bot.commands = new Discord.Collection();
bot.events = new Discord.Collection();
bot.databases = new Enmap({
    name: "databases",
    dataDir: "./src/database/"
});
module.exports = bot;

fs.readdirSync(`./src/events/`).forEach((file) => {
    if ( !file.endsWith(".js") ) return;

    require(`./events/${file}`)(bot);
});

require('./server/api'); // requiring our API service.
bot.login(process.env.botToken);