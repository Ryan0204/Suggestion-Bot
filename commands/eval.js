const { Message, Client, MessageEmbed } = require("discord.js");
const schema = require('../schema/beta');
module.exports = {
    name: "eval",
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args) => {
        if (message.author.id !== "660649920013008926") return;
        if (!args[0].join(" ")) return message.reply("Please enter some codes")
       try {
            const code = args[0].join(" ");
            let evaled = eval(code);
            const embed = new MessageEmbed()
                .setTitle(`Eval code for ${message.author.tag}`)
                .setDescription(`Input: \`\`\`${code}\`\`\`Output: \`\`\`${evaled}\`\`\``);
            message.channel.send({ embeds: [embed] });
       } catch (err) {
        const embed = new MessageEmbed()
            .setTitle(`Oops! Some error occurred`)
            .setDescription(`Error: \`\`\`${err}\`\`\``);
        message.channel.send({ embeds: [embed] });
       }
    },
};