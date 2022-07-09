const { Message, Client } = require("discord.js");
const schema = require('../schema/beta');
module.exports = {
    name: "beta",
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args) => {
        if (message.author.id !== "660649920013008926") return;
        if (!args[0]) return message.reply("Please enter add / remove")
        if (args[0] === "add") {
            if (!args[1]) return message.reply("Please enter guild id")
            schema.findOne({ GuildID: args[1] }, (err, data) => {
                if (data) data.delete();
                new schema({
                    GuildID: args[1],
                    Beta: true
                }).save();
            })
            return message.reply(`Successfully added \`${args[1]}\` to beta server list`);
        } else if (args[0] === "remove") {
            if (!args[1]) return message.reply("Please enter guild id")
            schema.findOne({ GuildID: args[1] }, (err, data) => {
                if (data) data.delete();
            })

            return message.reply(`Successfully removed \`${args[1]}\` from beta server list`);
        } else if (args[0] === "check") {
            if (!args[1]) return message.reply("Please enter guild id");
            schema.findOne({ GuildID: args[1] }, (err, data) => {
                if (data) return message.reply(`\`${args[1]}\` is in beta server list`);
                return message.reply(`\`${args[1]}\` is not in beta server list`);
            })
        }

    },
};