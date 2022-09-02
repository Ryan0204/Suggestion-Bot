const {
  Client,
  CommandInteraction,
  MessageEmbed,
  MessageSelectMenu,
  MessageActionRow,
  MessageButton,
} = require("discord.js");
const {
  red,
  green,
  blue,
  magenta,
  cyan,
  white,
  gray,
  black,
} = require("chalk");

const timestamp = Math.floor(Date.now() / 1000);
const constom_message = require("../../schema/suggestionSettings")
const channelSchema = require("../../schema/suggestChannel");

module.exports = {
  name: "reply",
  description: "回應建議",
  type: "CHAT_INPUT",
    applicationId: "955420795201544220",
    options: [
    {
      name: "message",
      description: "說明要回應的訊息 ID",
      type: "STRING",
      required: true,
    },
    {
      name: "type",
      description: "從上面的選項中選擇一個類型來編輯這個建議",
      type: "STRING",
      required: true,
      choices: [
        { name: `同意`, value: `accept_sug` },
        { name: `反對`, value: `decline_sug` },
        { name: `考慮`, value: `maybe_sug` },
      ],
    },
    {
      name: "reason",
      description: "說明您 接受/拒絕/考慮 這個建議的原因",
      type: "STRING",
      required: true,
    },
  ],
  /**
  * 
  * @param {Client} client
  * @param {CommandInteraction} interaction
  * @param {String[]} args
  */
  run: async (client, interaction, args) => {
    constom_message.findOne({ GuildID: interaction.guild.id }, async (err, data1) => {
      let sug_id = interaction.options.getString("message");
      let sug_type = interaction.options.getString("type");
      let sug_comment = interaction.options.getString("reason");
      let msg = await interaction.followUp(`⚠️ | 正在處理請求..`);

      if (!interaction.member.permissions.has("MANAGE_GUILD"))
        return msg.edit(`🔒 你沒有權限使用此指令！`);

      channelSchema.findOne(
        { GuildID: interaction.guild.id },
        async (err, data) => {
          if (!data) return msg.edit(`⚠  尷尬了，好像這個伺服器還未設置建議系統`);
          let ch_sug = interaction.guild.channels.cache.get(data.ChannelID);
          if (!ch_sug) return msg.edit(`🤔 我好像找不到這個頻道`);
          let x;
          let msg_sug = await ch_sug.messages.fetch(`${sug_id}`).catch(() => { });
          if (msg_sug == null)
            return msg.edit(`🤔 訊息 ID 無效！ 確保您提供有效的建議訊息 ID`);

          let new_typeColor;
          let new_typeName;
          let new_typeEmoji;
          if (sug_type == "accept_sug") {
            new_typeColor = data1 ? data1.EmbedColorAccept ? data1.EmbedColorAccept : client.config.color.green : client.config.color.green;
            new_typeName = "同意";
            new_typeEmoji = "🟢";
          } else if (sug_type == "decline_sug") {
            new_typeColor = data1 ? data1.EmbedColorDecline ? data1.EmbedColorDecline : client.config.color.red : client.config.color.red;
            new_typeName = "反對";
            new_typeEmoji = "🔴";
          } else if (sug_type == "maybe_sug") {
            new_typeColor = data1 ? data1.EmbedColorIdk ? data1.EmbedColorIdk : client.config.color.orange : client.config.color.orange;
            new_typeName = "考慮";
            new_typeEmoji = "🟠";
          }

          let msg_data = msg_sug.embeds[0];
          msg_data.addFields([
            {
              name: `${new_typeEmoji} 狀態：${new_typeName} [${interaction.user.username}] <t:${timestamp}>`,
              value: `${sug_comment}`,
            },
          ]);
          msg_data.setColor(`${new_typeColor}`);

          let row = new MessageActionRow().addComponents([
            new MessageButton()
              .setEmoji("❓")
              .setLabel("誰投票了？")
              .setStyle("PRIMARY")
              .setCustomId("who_voted"),
          ]);

          const emb2 = new MessageEmbed()
            .setTitle(`⭐ 已對建議作出回應`)
            .setThumbnail(msg_data.author.iconURL)
            .setColor(new_typeColor)
            .setDescription(
              `管理員 **[${interaction.user.username}]** 已對你的建議作出回應 [點擊我](https://discord.com/channels/${interaction.guild.id}/${data.ChannelIDID}/${sug_id}) 前往查看回應！ \n\n _**類別： ${new_typeName}**_`
            )
            .setFooter({
              text: `由 OuO Community 用 💖 製作`,
              iconURL: client.user.displayAvatarURL(),
            });

          let user_split = msg_data.author.name.replace(" 的提議", "");
          let user_dm = client.users.cache.find((x) => x.tag == user_split);
          if (user_dm) {
            user_dm.send({ embeds: [emb2] }).catch(() => { });
          }

          msg_sug.edit({ embeds: [msg_data] });
          return msg.edit(
            `⭐ 已成功對建議作出回應 **[${sug_id}]**，在這裡查看： <#${data.ChannelID}>`
          );
        }
      );
    })
  },
};
