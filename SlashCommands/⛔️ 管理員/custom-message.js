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
  const constom_message = require("../../schema/constom-message.js");
  module.exports = {
    name: "custom-message",
    description: "設置建議遷入顏色以及tag",
    options: [
      {
        name: "tag",
        description: "輸入tag誰",
        type: "ROLE",
        required: true,
      },{
        name: "color1",
        description: "輸入初始color(支持色碼)",
        type: "STRING",
        required: true,
      },{
        name: "color2",
        description: "輸入同意的color(支持色碼)",
        type: "STRING",
        required: true,
      },{
        name: "color3",
        description: "輸入不同意的color(支持色碼)",
        type: "STRING",
        required: true,
      },{
        name: "color4",
        description: "輸入考慮的color(支持色碼)",
        type: "STRING",
        required: true,
      },
    ],
    run: async (client, interaction, args) => {
      let tag = interaction.options.getRole("tag");
      let color1 = interaction.options.getString("color1");
      let color2 = interaction.options.getString("color2");
      let color3 = interaction.options.getString("color3");
      let color4 = interaction.options.getString("color4");
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
        { guild: interaction.guild.id },
        async (err, data) => {
          if (data) data.delete();

          new constom_message({
            guild: interaction.guild.id,
            message: tag,
            embedcolor_none: color1,
            embedcolor_good: color2,
            embedcolor_not: color3,
            embedcolor_idk: color4
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
  