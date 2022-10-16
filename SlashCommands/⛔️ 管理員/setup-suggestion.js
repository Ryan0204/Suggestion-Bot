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
const suggestSchema = require("../../schema/suggestChannel");
module.exports = {
<<<<<<< HEAD
    name: "setup-suggestion",
    description: "設置建議系統",
    applicationId: "955420795201544221",
    options: [
        {
            name: "channel",
            description: "選擇建議頻道",
            type: "CHANNEL",
            channelTypes: ["GUILD_TEXT"],
            required: true,
        },
    ],
=======
  name: "setup-suggestion",
  description: "設置建議系統",
  options: [
    {
      name: "channel",
      description: "選擇建議頻道",
      type: "CHANNEL",
      channelTypes: ["GUILD_TEXT"],
      required: true,
    },
  ],
>>>>>>> parent of 557e18a (✨ | 小更新)
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
<<<<<<< HEAD
    run: async (client, interaction, args) => {
        let channel = interaction.options.getChannel("channel");
        let message = await interaction.followUp({
            embeds: [
                new MessageEmbed()
                    .setTitle("⚠️ | 正在處理請求")
                    .setColor(config.color.grey),
            ],
=======
  run: async (client, interaction, args) => {
    let channel = interaction.options.getChannel("channel");
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
      .setTitle(`此頻道現已設置為建議頻道！`)
      .setFooter({
        text: "想建議/反饋？ 只需輸入在此頻道！",
        iconURL: `${client.user.displayAvatarURL()}`,
      })
      .setColor(config.color.grey);
    suggestSchema.findOne(
      { GuildID: interaction.guild.id },
      async (err, data) => {
        if (data) data.delete();

        new suggestSchema({
          GuildID: interaction.guild.id,
          ChannelID: channel.id,
        }).save();
        channel.send({ embeds: [enableEmbed] });
        return message.edit({
          embeds: [
            new MessageEmbed()
              .setTitle("✅ | 建議頻道初始化成功！")
              .setDescription(`💖 建議系統已成功設置：${channel}`)
              .setColor("GREEN")
              .setFooter({ text: '由 OuO 編程社群用 💖 製作', iconURL: client.user.displayAvatarURL()}),
          ],
>>>>>>> parent of 557e18a (✨ | 小更新)
        });

        if (
            !interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)
        )
            return message.edit({
                embeds: [
                    new MessageEmbed()
                        .setTitle("🔒 你沒有權限使用此指令！")
                        .setColor("RED"),
                ],
            });

        const enableEmbed = new MessageEmbed()
            .setTitle(`此頻道現已設置為建議頻道！`)
            .setFooter({
                text: "想建議/反饋？ 只需輸入在此頻道！",
                iconURL: `${client.user.displayAvatarURL()}`,
            })
            .setColor(config.color.grey);
        suggestSchema.findOne(
            { GuildID: interaction.guild.id },
            async (err, data) => {
                if (data) data.delete();

                new suggestSchema({
                    GuildID: interaction.guild.id,
                    ChannelID: channel.id,
                }).save();
                channel.send({ embeds: [enableEmbed] });
                return message.edit({
                    embeds: [
                        new MessageEmbed()
                            .setTitle("✅ | 建議頻道初始化成功！")
                            .setDescription(`💖 建議系統已成功設置：${channel}`)
                            .setColor("GREEN")
                            .setFooter({
                                text: "由 OuO 編程社群用 💖 製作",
                                iconURL: client.user.displayAvatarURL(),
                            }),
                    ],
                });
            }
        );
    },
};
