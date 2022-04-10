require("dotenv").config();
const express = require("express");
const axios = require('axios');
const Enmap = require("enmap");
const bot = require('../bot');

const app = express();

app.get("/", async (req, res) => {
    const props = {
        bot: bot
    };

    res.status(200)?.send(props)
});

app.get("/api/commands/:category", async (req, res) => {
    const slashCommands = require('../data');
    const { category } = req.params;

    if ( category ) {
        res.status(200).send(slashCommands.filter((cmd) => cmd.category?.toLowerCase() === category?.toLowerCase()).map((cmd) => cmd))
    } else res.status(200).send(slashCommands)
});

app.get("/api/commands", async (req, res) => {
    const slashCommands = require('../data');

    res.status(200).send(slashCommands)
});

app.get("/api/commands/:category/:command", async (req, res) => {
    const slashCommands = require('../data');
    const { command } = req.params;

    const cmd = slashCommands?.find((cmd) => (cmd.name)?.toLowerCase() === command?.toLowerCase())
    res.status(200).send(cmd);
});

app.get("/api/schema/:userId/:dbName/:key", async (req, res) => {
    const { dbName, userId, key } = req.params;
    if ( !dbName ) res.status(401).send(`Invaild Usage, please provide a dataname that you want to use..`)
    if ( !key ) res.status(404).send(`You must provide a data key, to use this database..`);

    const dbInfo = bot.databases.get(userId?.toString() ?? userId, "databases").find(
        (val) => val?.dbName?.toLowerCase() === dbName?.toLowerCase()
    );

    res.status(200).send(dbInfo);
});

app.listen(3000, () => console.log(`[API]: The webserver api has officially started.`));