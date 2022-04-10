const slashCommands = require('../data');

module.exports = async (bot) => {
    bot.on("ready", () => {
        console.log(`[BOT]: ${bot.user.username} is officially online!`)
        console.log(`[BOT]: Invite ${bot.user.username}: ${bot.generateInvite({
            scopes: ["applications.commands", "bot"],
            permissions: [
                "SEND_MESSAGES_IN_THREADS",
                "SEND_MESSAGES",
                "VIEW_CHANNEL",
                "CREATE_INSTANT_INVITE",
                "CHANGE_NICKNAME",
                "CREATE_PUBLIC_THREADS",
                "CREATE_PRIVATE_THREADS",
                "USE_EXTERNAL_EMOJIS",
                "READ_MESSAGE_HISTORY"
            ],
        })}`);
    
        /**
         * @INFO - setup slash commands for server only.
        */

        bot.guilds.cache.get('925927210282549289')
            .commands
            .set(slashCommands)
            .then((cmd) => `[SLASH-CMDS]: ${cmd.name} Set to ${bot.guilds.cache.get('925927210282549289').name}`);

        /**
         * @INFO - This is how to setup slash commands globally.
        */
        // bot.application.commands.set(slashCommands);
    
        for ( const cmd of slashCommands ) {
            if ( !cmd.name ) throw new TypeError(`[DATA/CMDS]: Missing Command Name for one of the slash commands.`)
            if ( !cmd.description ) throw new TypeError(`[DATA/CMDS]: Missing Command Description for one of the slash commands.`)
            
            bot.commands.set(cmd.name, cmd);
        };
    
        bot.user.setActivity(`In Development | ${bot.guilds.cache.size?.toLocaleString() ?? bot.guilds.cache.size} Guilds`, { type: "STREAMING" });
    });
}