const Discord = require('discord.js');
const data = require('../data');
const slashCommands = require('../data');

module.exports = async (bot) => {
    bot.on("interactionCreate", async(interaction) => {
        if ( interaction.isCommand() ) {
            await interaction.deferReply({ }).catch(() => { });
            
            const cmd = interaction.commandName;
            if ( !cmd ) return interaction.followUp({ content: `:x: This command is invaild, or is not available.`, ephemeral: true });
            
            const args = [];

            for (let option of interaction.options.data) {
                if (option.type === "SUB_COMMAND") {
                    if (option.name) args.push(option.name);
                    option.options?.forEach((x) => {
                        if (x.value) args.push(x.value);
                    });
                } else if (option.value) args.push(option.value);
            };

            interaction.member = interaction.guild.members.cache.get(interaction.user.id);

            const command = bot.commands.get(cmd.name);
            // await command.run({ bot, interaction, args });

            switch (cmd) {
                case "database" :
                    const subCommand = await interaction.options.getSubcommand();

                    switch( subCommand ) {
                        case "create" :
                            const dbName = interaction.options.getString("name");
                            bot.databases.ensure(interaction.user.id, {
                                databases: [],
                            });
                            if ( bot.databases.get(interaction.user.id, "databases").find((db) => db.dbName === dbName) ) return interaction.followUp({ embeds: [new Discord.MessageEmbed().setDescription(`> :x: This database schema already exists in your records.`).setColor("RED")] })
                            

                            if ( bot.databases.get(interaction.user.id, "databases")?.length > 3 ) return interaction.followUp({ embeds: [new Discord.MessageEmbed().setDescription(`> :x: You're maximum database limit has been reached.`).setColor("RED")]}) 
                            bot.databases.push(interaction.user.id, {
                                dbName: `${dbName?.toLowerCase()}`,
                                properties: [], // { ...props }
                            }, "databases", false);

                            if ( bot.databases.get(interaction.user.id, "databases").length < 1 ) return interaction.followUp({ embeds: [new Discord.MessageEmbed().setColor("GREEN").setDescription(`> 👏 **Hooray! you've successfully created your first database.**\n> View your database(s) with the \`/database view\` **command**.`)] })
                            else if ( bot.databases.get(interaction.user.id, "databases").length >= 1 ) return interaction.followUp({ embeds: [new Discord.MessageEmbed().setColor("GREEN").setDescription(`> 👏 **Hooray! you've successfully created your new database.**\n> View your database(s) with the \`/database view\` **command**.`)] })
                            break;
                        case "view" :
                            bot.databases.ensure(interaction.user.id, {
                                databases: [],
                            });
                            const dataname = interaction.options.getString("name");
                            if ( !dataname ) {
                                const datas = bot.databases.get(interaction.user.id, "databases")
                                const mappedData = datas.map((val, index) => {
                                    if ( !val.dbName ) throw new TypeError(`Seems like ${interaction.user} (${interaction.user.id}) has got an empty database name.`)
                                    if ( !val.properties ) return;

                                    return `**${index + 1}**. ${val?.dbName?.charAt(0).toUpperCase()}${val?.dbName?.slice(1).toLowerCase()}`
                                }).join("\n");

                                return interaction.followUp({ embeds: [
                                    new Discord.MessageEmbed()
                                    .setTitle(`Database Schema(s)`)
                                    .setColor("BLURPLE")
                                    .setDescription(`> 🚀 **Now viewing, all of your current created database(s).**\n\n${mappedData}`)
                                ] });
                            };
                            const datas = bot.databases.get(interaction.user.id, "databases")
                            
                            const isVaild = !!datas.find((val) => val.dbName?.toLowerCase() === dataname)
                            if ( !isVaild ) return interaction.followUp({ embeds: [new Discord.MessageEmbed().setDescription(`> :x: This database schema doesn't seem to exists in your records.`).setColor("RED")] })
                            
                            // const dbProperties = bot.databases.get(interaction.user.id, "databases").find((db) => db.dbName === dataname).get("properties").map((prop, i) => `**${i+1}.** ${prop?.name} -. ${prop?.type || "STRING"}`).join("\n")

                            const embed = new Discord.MessageEmbed()
                            .setColor("BLURPLE")
                            .setDescription(`> 📋 You're now viewing the ${dataname?.toLowerCase()} database schema.`)
                            .addField(`Data Name`, `> ${dataname?.charAt(0).toUpperCase() + dataname?.slice(1).toLowerCase()}`)
                            .addField(`Data Properties`, `> :warning: Coming Soon!`)

                            return interaction.followUp({ embeds: [embed]})
                            break;
                    case "delete" : {
                            bot.databases.ensure(interaction.user.id, {
                                databases: [],
                            });
                            const dataName = interaction.options.getString("name");
                            const datas = bot.databases.get(interaction.user.id, "databases")

                            const isVaildDb = !!datas.find((val) => val.dbName?.toLowerCase() === dataName)
                            
                            if ( !dataName ) {
                                let Buttons = [];
                                // let components = [
                                    
                                    // ];
                                    
                                    for ( const db of datas ) {
                                        const dbName = db.dbName;
                                        const dbProperties = db.properties;
                                        
                                        const newButton = new Discord.MessageButton()
                                        .setCustomId(`delete-${dbName}`)
                                        .setDisabled(false)
                                        .setLabel(`${dbName?.charAt(0).toUpperCase()}${dbName?.slice(1).toLowerCase()}`)
                                        .setStyle(`SECONDARY`)
                                        
                                        Buttons.push(newButton);
                                    };

                                let components = (state) => [
                                    new Discord.MessageActionRow().addComponents(
                                        Buttons
                                    )
                                ]
                                const initialMessage = await interaction.followUp({ embeds: [new Discord.MessageEmbed().setColor(`BLURPLE`).setDescription(`> **🤔 Please select which database you want to delete.**`)], components: components(false), ephemeral: true });
                                const filter = (i) => i.user.id === interaction.user.id && i.isButton();
                                
                                const col = interaction.channel.createMessageComponentCollector({
                                    filter,
                                    time: 60000,
                                    componentType: "BUTTON"
                                });

                                
                                col.on("collect", async (int) => {
                                    for ( var i = 0; i < datas.length; i++ ) {
                                        for ( const db of datas ) {
                                            const dbName = db.dbName;
                                            // const dbProperties = db.properties;

                                            /**
                                             * @INFO - lets delete that database the user entered.
                                            */
                                            
                                            if ( int.customId === `delete-${dbName}` ) {
                                                datas.splice(datas.indexOf(db), 1);
                                                i--;
                                                initialMessage.edit({ components: components(true) });
                                                return interaction.followUp({ ephemeral: true, embeds: [new Discord.MessageEmbed().setColor("GREEN").setDescription(`> **:thumbsup: Successfully deleted the database, ${dbName?.charAt(0).toUpperCase()}${dbName?.slice(1).toLowerCase()}**`)] })
                                            };

                                        }
                                    };
                                });
                                
                                col.on("end", (collected) => initialMessage.edit({ components: components(true) }))
                            } else {
                                if ( !isVaildDb ) return interaction.followUp({ embeds: [new Discord.MessageEmbed().setDescription(`> :x: This database schema doesn't seem to exists in your records.`).setColor("RED")] })
                            };
                        }
                    };
                    break;
                case "help" :
                    const commands = slashCommands.map((cmd) => 
                    {
                        // const options = [];

                        if ( cmd.options ) {
                            (cmd.options).map((option) => `\`${cmd.name} ${option?.name}\``).join(", ");
                        } else return `\`${cmd.name}\``;
                    }).join(", ");
                    const components = (state) => [new Discord.MessageActionRow().addComponents(
                        new Discord.MessageButton()
                        .setLabel(`Invite Bot`)
                        .setURL(
                            bot.generateInvite({
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
                            })
                        )
                        .setDisabled(false)
                        .setStyle(`LINK`),
                        new Discord.MessageButton()
                        .setLabel(`Commands List`)
                        .setStyle("LINK")
                        .setURL(`http://localhost:3000/commands`),
                        new Discord.MessageButton()
                        .setLabel(`Website`)
                        .setURL(`https://www.dbmanager.tk`)
                        .setStyle(`LINK`),
                        new Discord.MessageButton()
                        .setLabel(`Icons Server`)
                        .setURL(`https://discord.gg/YbmQ4WTh`)
                        .setStyle(`LINK`),
                    )
                    ];

                    return interaction.followUp({ embeds: [
                        new Discord.MessageEmbed()
                        .setAuthor({ name: `${bot.user.username}'s Help Menu`, iconURL: bot.user.displayAvatarURL(), url: `https://www.dbmanager.tk/commands` })
                        .setColor("BLURPLE")
                        .setDescription(`> **Hello there, I'm ${bot.user.username}** my main purpose is to help you create/manage your Db(s)/Database(s)!`)
                        .setThumbnail(bot.user.displayAvatarURL())
                    ], ephemeral: true, components: components(false) });
                    break;
            };
        };
    });
}