const {
    Client,
    CommandInteraction,
    MessageEmbed,
    MessageActionRow,
    MessageButton,
} = require("discord.js");
const starboardSchema = require("../../schema/starboard");
module.exports = {
    name: "config-starboard",
    description: "設定星版系統",
    type: "CHAT_INPUT",
    applicationId: "1004678423626649611",
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

        
        const data = await starboardSchema.findOne({
            GuildID: interaction.guild.id,
        });
        // Check enabled starboard system or not
        let embed;
        let row;
        if (data.Enabled === false) {
            embed = new MessageEmbed()
                .setTitle(`星版系統 - 控制面板`)
                .setDescription(`點擊以下按鈕來設定星版系統`)
                .setFooter({
                    iconURL: client.user.avatarURL({ dynamic: true }),
                    text: "Suggestion Bot ∙ 將 Discord 變成不一樣的 Discord",
                })
                .setColor("GREEN");

            row = new MessageActionRow().addComponents(
                new MessageButton()
                    .setCustomId("reactionCount")
                    .setLabel("更改星星數目")
                    .setStyle("SECONDARY"),
                new MessageButton()
                    .setCustomId("starboardChannel")
                    .setLabel("更改星版頻道")
                    .setStyle("SECONDARY"),
                new MessageButton()
                    .setCustomId("enableStarboardSystem")
                    .setLabel("啟用星版系統")
                    .setStyle("SUCCESS")
            );
        } else {
            embed = new MessageEmbed()
                .setTitle(`星版系統 - 控制面板`)
                .setDescription(`點擊以下按鈕來設定星版系統`)
                .setFooter({
                    iconURL: client.user.avatarURL({ dynamic: true }),
                    text: "Suggestion Bot ∙ 將 Discord 變成不一樣的 Discord",
                })
                .setColor("GREEN");

            row = new MessageActionRow().addComponents(
                new MessageButton()
                    .setCustomId("reactionCount")
                    .setLabel("更改星星數目")
                    .setStyle("SECONDARY"),
                new MessageButton()
                    .setCustomId("starboardChannel")
                    .setLabel("更改星版頻道")
                    .setStyle("SECONDARY"),
                new MessageButton()
                    .setCustomId("disableStarboardSystem")
                    .setLabel("停用星版系統")
                    .setStyle("DANGER")
            );
        }
        interaction.editReply({ embeds: [embed], components: [row] });
    },
};
