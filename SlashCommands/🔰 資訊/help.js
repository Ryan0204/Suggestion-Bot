const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const { readdirSync } = require("fs");
const path = require("path");
const client = require("../..");
module.exports = {
  name: "help",
  description: "查看機器人的所有指令",
  type: "CHAT_INPUT",
  run: async (client, interaction, args) => {
    let categories = [];

    readdirSync(path.join(__dirname, `..`)).forEach((dir) => {
      const commands = readdirSync(path.join(__dirname, `..`, `${dir}`)).filter(
        (file) => file.endsWith(".js")
      );

      const cmds = commands.map((command) => {
        let file = require(path.join(__dirname, `..`, `${dir}`, `${command}`));
        if (!file.name) return "Missing file name.";
        if (!file.description) return "Missing description.";
        let name = file.name.replace(".js", "");
        let description = file.description;
        return `\`/${name}\`\n> ${description}\n`;
      });
      let data = new Object();

      data = {
        name: dir.toUpperCase(),
        value: cmds.length === 0 ? "WIP 🦺" : cmds.join(" "),
      };

      categories.push(data);
    });

    const embed = new MessageEmbed()
      .setTitle(`💡 | 提議機器人`)
      .setURL('https://discord.gg/HAN45Zaknr')
      .setColor(client.config.color.blue)

      .addFields(categories)
      .setFooter({
        text: `${client.user.tag} | 由 OuO 編程社群用 💖 製作`,
        iconURL: client.user.displayAvatarURL(),
      });
    return interaction.followUp({ embeds: [embed] });
  },
};
