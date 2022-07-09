const {
    Client,
    CommandInteraction,
    MessageEmbed,
    MessageSelectMenu,
    MessageActionRow,
    MessageButton,
    Permissions,
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
  const config = require("../../config.json");
  const starboardSchema = require("../../schema/starboard");
  
  module.exports = {
    name: "setup-starboard",
    description: "設置星版系統",
    options: [
      {
        name: "頻道",
        description: "選擇星版頻道",
        type: "CHANNEL",
        channelTypes: ["GUILD_TEXT"],
        required: true,
      },
      {
        name: "數目",
        description: "當星星數目達到，就會記錄該訊息",
        type: "INTEGER",
        require: false,
      },
    ],
    /**
    * 
    * @param {Client} client
    * @param {CommandInteraction} interaction
    * @param {String[]} args
    */
    run: async (client, interaction, args) => {
      const betaSchema = require("../../schema/beta");
      const checkBeta = await betaSchema.findOne({ GuildID: interaction.guild.id })
      if (!checkBeta) return interaction.editReply({ content: `哎呀！此命令僅適用於測試版伺服器 \n 想要申請？加入 https://discord.gg/ouodev`, ephemeral: true })
      let channel = interaction.options.getChannel("頻道");
      let count = interaction.options.getInteger("數目")

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
        
      const enableEmbed = new MessageEmbed()
        .setTitle(`此頻道現已設置為星版頻道！`)
        .setColor(config.color.grey);

      starboardSchema.findOne(
        { GuildID: interaction.guild.id },
        async (err, data) => {
          if (data) data.delete();
  
          new starboardSchema({
            GuildID: interaction.guild.id,
            ChannelID: channel.id,
            Enabled: true,
            Count: count || 5,
          }).save();

          // channel.send({ embeds: [enableEmbed] });

          return message.edit({
            embeds: [
              new MessageEmbed()
                .setTitle("✅ | 星版頻道初始化成功！")
                .setDescription(`💖 星版系統已成功設置：${channel}`)
                .setColor("GREEN")
                .setFooter({ text: '由 OuO 編程社群用 💖 製作', iconURL: client.user.displayAvatarURL()}),
            ],
          });
        }
      );
    },
  };
  