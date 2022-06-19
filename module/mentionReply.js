const {
  MessageEmbed,
  MessageButton,
  MessageActionRow,
  Message,
} = require("discord.js");
const client = require("../index");

client.on("messageCreate", (message) => {
  if (message.author.bot) return false;
  if (
    message.content.includes("@here") ||
    message.content.includes("@everyone") ||
    message.type === "REPLY"
  )
    return false;
  if (message.mentions.has(client.user.id)) {
    const embed = new MessageEmbed()
      .setTitle("你標註了我？")
      .setAuthor({
        name: client.user.username,
        iconURL: client.user.displayAvatarURL(),
      })
      .setDescription(
        `
            倘若想使用我，請使用 \`/help\`！
            無法使用斜線（/）指令？輸入 \`${client.config.prefix}deploy\` / 重新邀請機器人！
            `
      )
      .setColor("BLUE");
    const row = new MessageActionRow().addComponents(
      new MessageButton()
        .setLabel(`邀請我到你的伺服器！`)
        .setEmoji(`861545738303832095`)
        .setStyle("LINK")
        .setURL(
          `https://discord.com/oauth2/authorize?client_id=${client.user.id}&permissions=137506581616&scope=bot%20applications.commands`
        )
    );
    message.reply({ embeds: [embed], components: [row] });
  }
});
