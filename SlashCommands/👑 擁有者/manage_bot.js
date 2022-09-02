const { Client, CommandInteraction } = require("discord.js");
const Discord = require(`discord.js`);
const glob = require("glob");
module.exports = {
    name: "manage-bot",
    description: "管理機器人",
    applicationId: "955420795201544222",
    type: "CHAT_INPUT",
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {
        if (!client.config.developers.includes(interaction.user.id))
            return interaction.followUp(`🔒 你沒有權限使用此指令！`);

        let clientapp = client.application
            ? await client.application.fetch().catch((e) => false)
            : false;

        const control = new Discord.MessageEmbed()
            .setColor(`BLUE`)
            .setAuthor({
                name: `${client.user.username} | 機器人控制面板`,
                iconURL: client.user.displayAvatarURL(),
            })
            .setDescription(
                `<a:arrow:953615003230031922> **檔案路徑：**
      \`\`\`yml
${process.cwd()}\`\`\`

      ${
          clientapp
              ? `<a:arrow:953615003230031922> **機器人訊息：**
      \`\`\`yml
機器人名稱：${clientapp.name} 
頭像：${clientapp.iconURL()}\`\`\`
      <a:arrow:953615003230031922> **關於我：**
      \`\`\`yml
${clientapp.description ? clientapp.description : "❌ 未設置！"}\`\`\``
              : ""
      }
      `
            )
            .setFooter({ text: `由 OuO Community 製作` });

        interaction.followUp({
            embeds: [control],
            components: [
                new Discord.MessageActionRow().addComponents(
                    new Discord.MessageSelectMenu()
                        .setCustomId("manage_bot")
                        .setPlaceholder(`控制機器人 | ${client.user.username}`)
                        .addOptions([
                            {
                                label: `關閉機器人`,
                                description: `在緊急情況下關閉機器人！`,
                                value: `stop_client`,
                                emoji: `934152965856591953`,
                            },
                            {
                                label: `更改名稱`,
                                description: `更改機器人名稱！`,
                                value: `rename_client`,
                                emoji: `📝`,
                            },
                            {
                                label: `更改頭像`,
                                description: `更改機器人頭像！`,
                                value: `changeav_client`,
                                emoji: `📸`,
                            },
                        ])
                ),
            ],
        });
    },
};
