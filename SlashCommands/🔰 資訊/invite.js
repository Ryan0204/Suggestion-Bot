const {
    Client,
    CommandInteraction,
    MessageEmbed,
    MessageActionRow,
    MessageButton,
} = require("discord.js");
/**
*
* @param {Client} client
* @param {CommandInteraction} interaction
* @param {String[]} args
*/
module.exports = {
<<<<<<< HEAD
    name: "invite",
    description: "獲取機器人的邀請鏈接",
    applicationId: "955420795201544224",
    type: "CHAT_INPUT",
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {
        const emb = new MessageEmbed()
            .setColor(client.config.color.main)
            .setTitle(`邀請 ${client.user.username}`)
            .setDescription(
                `感謝您選擇使用 **${client.user.username}**，您可以點擊下面的按鈕來邀請我唷！`
            )
            .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
            .setFooter({ text: `由 OuO Community 用 💖 製作` });
=======
  name: "invite",
  description: "獲取機器人的邀請鏈接",
  type: "CHAT_INPUT",
  run: async (client, interaction, args) => {
    const emb = new MessageEmbed()
      .setColor(client.config.color.main)
      .setTitle(`邀請 ${client.user.username}`)
      .setDescription(
        `感謝您選擇使用 **${client.user.username}**，您可以點擊下面的按鈕來邀請我唷！`
      )
      .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
      .setFooter({ text: `由 OuO Community 用 💖 製作` });
>>>>>>> parent of 557e18a (✨ | 小更新)

        const row = new MessageActionRow().addComponents(
            new MessageButton()
                .setURL(
                    `https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=139586825281&scope=bot%20applications.commands`
                )
                .setLabel("邀請我")
                .setStyle("LINK")
        );

        interaction.followUp({
            content: ` `,
            embeds: [emb],
            components: [row],
        });
    },
};
