const {
    Client,
    CommandInteraction,
    MessageEmbed,
    MessageSelectMenu,
    MessageActionRow,
    MessageButton,
    Permissions,
  } = require("discord.js");
  var validateColor = require("validate-color").default;
  const config = require("../../config.json");
  const constom_message = require("../../schema/constomMessage.js");
  module.exports = {
    name: "custom-message",
    description: "設置建議嵌入顏色以及tag",
    options: [
      {
        name: "標注",
        description: "輸入要標注誰",
        type: "ROLE",
        required: true,
      },{
        name: "初始顏色",
        description: "輸入初始顏色(支持色碼)",
        type: "STRING",
        required: true,
      },{
        name: "同意顏色",
        description: "輸入同意的顏色(支持色碼)",
        type: "STRING",
        required: true,
      },{
        name: "不同意顏色",
        description: "輸入不同意的顏色(支持色碼)",
        type: "STRING",
        required: true,
      },{
        name: "考慮顏色",
        description: "輸入考慮的顏色(支持色碼)",
        type: "STRING",
        required: true,
      },
    ],
    run: async (client, interaction, args) => {
      let tag = interaction.options.getRole("標注");
      let color1 = interaction.options.getString("初始顏色");
      let color2 = interaction.options.getString("同意顏色");
      let color3 = interaction.options.getString("不同意顏色");
      let color4 = interaction.options.getString("考慮顏色");
      if(!validateColor(color1) || !validateColor(color2) || !validateColor(color3) || !validateColor(color4)){
        return interaction.reply(":x: 我只支持色碼!")
      }
      let message = await interaction.followUp({
        embeds: [
          new MessageEmbed()
            .setTitle("⚠️ | 正在處理請求")
            .setColor(config.color.grey),
        ],
      });
  
      if (!interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR))
        return message.edit({
          embeds: [
            new MessageEmbed()
              .setTitle("🔒 你沒有權限使用此指令！")
              .setColor("RED"),
          ],
        });
        constom_message.findOne(
        { GuildID: interaction.guild.id },
        async (err, data) => {
          if (data) data.delete();

          new constom_message({
            GuildID: interaction.guild.id,
            Mention: tag,
            EmbedColorDefault: color1,
            EmbedColorAccept: color2,
            EmbedColorDecline: color3,
            EmbedColorIdk: color4
          }).save();
          message.edit({ embeds: [
            new MessageEmbed()
              .setTitle("✅ | 建議訊息更改成功!")
              .setColor(config.color.grey),
          ], });
        }
      );
    },
  };
  