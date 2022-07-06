const {
    Client,
    CommandInteraction,
    MessageEmbed,
    MessageActionRow,
    MessageButton,
    Message,
    MessageSelectMenu,
} = require("discord.js");
const { emojis } = require("../../index.js");
const pollSchema = require("../../schema/poll.js");
module.exports = {
    name: "poll",
    description: "投票系統",
    type: "CHAT_INPUT",
    options: [
        {
            name: "問題",
            description: "投票問題",
            type: "STRING",
            required: true,
        },
        {
            name: "是否題",
            description: "選項只有是 / 否",
            type: "BOOLEAN",
            required: true,
        },
        {
            name: "選項",
            description: "使用 ^ 分隔選項",
            type: "STRING",
            required: false,
        },
        {
            name: "標注",
            description: "選擇你要tag誰或身分組(可不標注)",
            type: "STRING",
            required: false,
        },
        {
            name: "圖片1",
            description: "放上你要的圖片",
            type: "ATTACHMENT",
            required: false,
        },
        {
            name: "圖片2",
            description: "放上你要的圖片",
            type: "ATTACHMENT",
            required: false,
        },
    ],
    deferReply: true,
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {
        let members;
        if (
            interaction.guild.members.cache.size ===
            interaction.guild.memberCount
        )
            members = interaction.guild.members.cache.filter(
                (member) => !member.user.bot
            ).size;
        else
            members = (await interaction.guild.members.fetch()).filter(
                (member) => !member.user.bot
            ).size;
        if (!interaction.member.permissions.has("MANAGE_GUILD"))
        return interaction.editReply({
                content: `🔒 你沒有權限使用此指令！`,
                ephemeral: true,
            });
        const question = interaction.options.getString("問題");
        const truefalse = interaction.options.getBoolean("是否題");
        const options = interaction.options.getString("選項");
        const tag = interaction.options.getString("標注");
        const pic = interaction.options.getAttachment("圖片");
        if(pic && !pic.contentType.includes("image")) return interaction.editReply(":x: 你給的檔案不是圖片!!")
        let controlRow = new MessageActionRow().addComponents(
            new MessageSelectMenu()
                .setCustomId("control")
                .setPlaceholder("發起人操作")
                .addOptions([
                    {
                        label: "公開投票結果",
                        description: "讓所有成員都能查看投票結果",
                        value: "visible",
                        emoji: "987607934269784085",
                    },
                    {
                        label: "結束投票",
                        description: "投票被終止後將不能再投票",
                        value: "end",
                        emoji: "987917220174774292",
                    },
                ])
        );
        if (truefalse === true) {
            let embed = new MessageEmbed()
                .setAuthor({ name: "📖 | 投票" })
                .setTitle(question)
                .setDescription(`總投票數: 0 / ${members} | 參與率: 0.00%`)
                .setFooter({
                    text: `${interaction.user.username} 發起了投票`,
                    iconURL: interaction.user.avatarURL({ dynamic: true }),
                })
                .setImage(pic ? pic.proxyURL : null)
                .setColor("RANDOM");
            let messageRow = new MessageActionRow().addComponents(
                new MessageButton()
                    .setLabel("是")
                    .setStyle("SECONDARY")
                    .setCustomId("Option1"),
                new MessageButton()
                    .setLabel("否")
                    .setStyle("SECONDARY") 
                    .setCustomId("Option2"),
                new MessageButton()
                    .setLabel("查看投票結果")
                    .setStyle("PRIMARY")
                    .setEmoji("987607934269784085")
                    .setCustomId("showChart")
            );

            const sentMsg = await interaction.channel.send({
                content: tag ? tag : null,
                embeds: [embed],
                components: [messageRow, controlRow],
            });
            pollSchema({
                MessageID: sentMsg.id,
                OwnerID: interaction.user.id,
                Title: question,
                Options: ["是", "否"],
                Public: false,
                Ended: false,
            }).save();
        } else {
            if (options === null)
                return interaction.editReply({
                    embeds: [
                        new MessageEmbed()
                            .setTitle("❌ | 請提供選項")
                            .setColor("RED"),
                    ],
                    ephemeral: true,
                });
            let array = options.split("^");
            console.log(array.length)
            if (array.length > 10)
                return interaction.editReply({
                    embeds: [
                        new MessageEmbed()
                            .setTitle(`❌ | 最多10個選項`)
                            .setColor("RED"),
                    ],
                    ephemeral: true,
                });
            let embed = new MessageEmbed()
                .setAuthor({ name: "📖 | 投票" })
                .setTitle(question)
                .setDescription(`總投票數: 0 / ${members} | 參與率: 0.00%`)
                .setFooter({
                    text: `${interaction.user.username} 發起了投票`,
                    iconURL: interaction.user.avatarURL({ dynamic: true }),
                })
                .setColor("RANDOM");
            let array1 = [];
            let array2 = [];
            let array3 = [];
            array.forEach((value, index) => {
                if (index < 5) {
                    array1.push(value);
                }

                if (index <= 10 && index >= 5) {
                    array2.push(value);
                }
            });

            if (array1.length < 5 && array2.length === 0) {
                let messageRow = new MessageActionRow().addComponents(
                    array.map((value, i) => {
                        const button = new MessageButton()
                            .setLabel(`${value}`)
                            .setStyle("SECONDARY")
                            .setCustomId(`Option${i + 1}`);

                        return button;
                    }),
                    new MessageButton()
                        .setLabel("查看投票結果")
                        .setStyle("PRIMARY")
                        .setEmoji("987607934269784085")
                        .setCustomId("showChart")
                );
                const sentMsg = await interaction.channel.send({
                    embeds: [embed],
                    components: [messageRow, controlRow],
                });
                pollSchema({
                    MessageID: sentMsg.id,
                    OwnerID: interaction.user.id,
                    Title: question,
                    Options: array,
                    Public: false,
                    Ended: false,
                }).save();
            } else if (array1.length === 5 && array2.length === 0) {
                let messageRow = new MessageActionRow().addComponents(
                    array.map((value, i) => {
                        const button = new MessageButton()
                            .setLabel(`${value}`)
                            .setStyle("SECONDARY")
                            .setCustomId(`Option${i + 1}`);

                        return button;
                    })
                );
                let messageRow2 = new MessageActionRow().addComponents(
                    new MessageButton()
                        .setLabel("查看投票結果")
                        .setStyle("PRIMARY")
                        .setEmoji("987607934269784085")
                        .setCustomId("showChart")
                );
                const sentMsg = await interaction.channel.send({
                    embeds: [embed],
                    components: [messageRow, messageRow2, controlRow],
                });
                pollSchema({
                    MessageID: sentMsg.id,
                    OwnerID: interaction.user.id,
                    Title: question,
                    Options: array,
                    Public: false,
                    Ended: false,
                }).save();
            } else if (array1.length === 5 && array2.length < 5) {
                let messageRow = new MessageActionRow().addComponents(
                    array1.map((value, i) => {
                        const button = new MessageButton()
                            .setLabel(`${value}`)
                            .setStyle("SECONDARY")
                            .setCustomId(`Option${i + 1}`);

                        return button;
                    })
                );
                let messageRow2 = new MessageActionRow().addComponents(
                    array2.map((value, i) => {
                        const button = new MessageButton()
                            .setLabel(`${value}`)
                            .setStyle("SECONDARY")
                            .setCustomId(`Option${i + 1 + 5}`);

                        return button;
                    }),
                    new MessageButton()
                        .setLabel("查看投票結果")
                        .setStyle("PRIMARY")
                        .setEmoji("987607934269784085")
                        .setCustomId("showChart")
                );
                const sentMsg = await interaction.channel.send({
                    embeds: [embed],
                    components: [messageRow, messageRow2, controlRow],
                });
                pollSchema({
                    MessageID: sentMsg.id,
                    OwnerID: interaction.user.id,
                    Title: question,
                    Options: array,
                    Public: false,
                    Ended: false,
                }).save();
            } else if (array1.length === 5 && array2.length === 5) {
                let messageRow = new MessageActionRow().addComponents(
                    array1.map((value, i) => {
                        const button = new MessageButton()
                            .setLabel(`${value}`)
                            .setStyle("SECONDARY")
                            .setCustomId(`Option${i + 1}`);

                        return button;
                    })
                );
                let messageRow2 = new MessageActionRow().addComponents(
                    array2.map((value, i) => {
                        const button = new MessageButton()
                            .setLabel(`${value}`)
                            .setStyle("SECONDARY")
                            .setCustomId(`Option${i + 1 + 5}`);

                        return button;
                    })
                );
                let messageRow3 = new MessageActionRow().addComponents(
                    new MessageButton()
                        .setLabel("查看投票結果")
                        .setStyle("PRIMARY")
                        .setEmoji("987607934269784085")
                        .setCustomId("showChart")
                );

                const sentMsg = await interaction.channel.send({
                    embeds: [embed],
                    components: [
                        messageRow,
                        messageRow2,
                        messageRow3,
                        controlRow,
                    ],
                });
                pollSchema({
                    MessageID: sentMsg.id,
                    OwnerID: interaction.user.id,
                    Title: question,
                    Options: array,
                    Public: false,
                    Ended: false,
                }).save();
            }
        }

        interaction.editReply({
            embeds: [
                new MessageEmbed()
                    .setDescription(
                        `<:poll:987607934269784085> - 已成功創建投票`
                    )
                    .setColor("BLURPLE"),
            ],
            ephemeral: true,
        });
    },
};
