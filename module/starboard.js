const {
    Interaction,
    ReactionCollector,
    MessageEmbed,
    Modal,
    MessageActionRow,
    TextInputComponent,
    MessageButton,
    Permissions,
    MessageSelectMenu
} = require("discord.js");
const client = require("..");
const betaSchema = require("../schema/beta");
const starboardSchema = require("../schema/starboard");
/**
 *
 * @param {Client} client
 * @param {CommandInteraction} interaction
 * @param {String[]} args
 */
client.on("messageReactionAdd", (reaction) => {
    const checkBeta = betaSchema.findOne({ GuildID: reaction.message.guildId })
    if (!checkBeta) return;
    const guildId = reaction.message.guildId;
    starboardSchema.findOne({ GuildID: guildId }, async (err, data) => {
        if (!data) return;
        if (data.Enabled != true) return;
        await reaction.fetch();
        if (reaction.count < data.Count) return;
        const starChannel = client.channels.cache.get(data.ChannelID);
        if (!starChannel) return;
        if (reaction.message.author.id === "955419318630375445") return;
        const handlerStarboard = async () => {
            const fetchedMessages = await starChannel.messages.fetch({
                limit: 100,
            });
            const sentMessage = fetchedMessages.find((m) =>
                m.embeds.length === 1
                    ? m.embeds[0].footer.text.startsWith(reaction.message.id)
                        ? true
                        : false
                    : false
            );
            if (sentMessage) {
                sentMessage.edit({ content: `${reaction.count} - :star: | ${reaction.message.channel}` });
            } else {
                // console.log(reaction.message.attachments.first().url)
                const image =
                    reaction.message.attachments.size > 0
                        ? await getImage(
                            reaction,
                            reaction.message.attachments.first().url
                        )
                        : "";
                const embed = new MessageEmbed()
                    .setAuthor({
                        name: reaction.message.author.tag,
                        iconURL: reaction.message.author.displayAvatarURL({
                            dynamic: true,
                        }),
                    })
                    .setDescription(
                        `${reaction.message.content}\n\n**[????????????](${reaction.message.url})**`
                    )
                    .setColor("YELLOW")
                    .setTimestamp()
                    .setImage(image)
                    .setFooter({ text: reaction.message.id });
                if (starChannel) {
                    const starMsg = await starChannel.send({ content: `1 - :star: | ${reaction.message.channel}`, embeds: [embed] })
                    starMsg.react('???');
                }

            }
        };

        if (reaction.emoji.name === "???") {
            if (reaction.message.partial) {
                await reaction.fetch();
                await reaction.message.fetch();
                handlerStarboard();
            } else {
                handlerStarboard();
            }
        }
    });
});

client.on("messageReactionRemove", (reaction) => {


    const checkBeta = betaSchema.findOne({ GuildID: reaction.message.guildId })
    if (!checkBeta) return;
    const { message } = reaction;
    const guildId = reaction.message.guildId;
    starboardSchema.findOne({ GuildID: guildId }, async (err, data) => {
        if (!data) return;
        if (data.Enabled != true) return;
        const guildId = reaction.message.guildId;
        const starChannel = client.channels.cache.get(data.ChannelID);
        if (!starChannel) return;
        if (reaction.message.author.id === "955419318630375445") return;
        const handlerStarboard = async () => {
            const fetchedMessages = await starChannel.messages.fetch({
                limit: 100,
            });
            const starMessage = fetchedMessages.find((m) =>
                m.embeds.length === 1
                    ? m.embeds[0].footer.text.startsWith(reaction.message.id)
                        ? true
                        : false
                    : false
            );
            if (starMessage) {
                starMessage.edit({
                    content: `${parseInt(starMessage.content[0] - 1)} - :star: | ${reaction.message.channel}`,
                });
            }
            if (starMessage) {
                if (parseInt(starMessage.content[0] - 1) === 0) {
                    return setTimeout(() => {
                        starMessage.delete(), 1000;
                    });

                }
            }
        };

        if (reaction.emoji.name === "???") {
            if (reaction.message.partial) {
                await reaction.fetch();
                await reaction.message.fetch();
                handlerStarboard();
            } else {
                handlerStarboard();
            }
        }
    });
});

function getImage(reaction, attachment) {
    const imagelink = attachment.split(".");
    const typeOffImage = imagelink[imagelink.length - 1];
    const image = /(jpg|jpeg|png|gif)/gi.test(typeOffImage);
    if (!image) return "";
    return attachment;
}

/* Config StarBoard Command Code */

client.on("interactionCreate", (interaction) => {
    if (!interaction.isButton()) return;
    if (interaction.customId !== "reactionCount" || "disableStarboardSystem" || "enableStarboardSystem" || "starboardChannel" || "setChannelID") return;
    if (!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) {
        return interaction.reply({ 
            embeds: [
                new MessageEmbed()
                    .setDescription(`${client.config.emoji.error} | ???????????????????????????\`???????????????\``)
                    .setColor(client.config.color.red)
                    .setFooter({
                        iconURL: client.user.avatarURL({ dynamic: true }),
                        text: "Suggestion Bot ??? ??? Discord ?????????????????? Discord",
                    })
            ], 
            ephemeral: true,
        })
    }
    
    if (interaction.customId === "reactionCount") {
        starboardSchema.findOne(
            { GuildID: interaction.guild.id },
            async (err, data) => {
                if (!data) {
                } else {
                    const reactionCountModal = new Modal()
                        .setCustomId("reactionCountModal")
                        .setTitle("??????????????????");
                    const reactionCountRow =
                        new MessageActionRow().addComponents(
                            new TextInputComponent()
                                .setCustomId("reactionCountNumber")
                                .setLabel("????????????")
                                .setStyle("SHORT")
                                .setPlaceholder("5")
                                .setRequired(true)
                                .setValue(`${data.Count}`)
                        );
                    reactionCountModal.addComponents(reactionCountRow);
                    interaction.showModal(reactionCountModal);
                }
            }
        );
    } else if (interaction.customId === "disableStarboardSystem") {
        starboardSchema.findOneAndUpdate(
            { GuildID: interaction.guild.id },
            {
                $set: {
                    Enabled: false,
                },
            },
            async (err, data) => {
                data.save();
            }
        );
        interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setDescription(
                        `<a:success:992779451052072984> | ?????????????????????`
                    )
                    .setColor(client.config.color.success)
                    .setFooter({
                        iconURL: client.user.avatarURL({ dynamic: true }),
                        text: "Suggestion Bot ??? ??? Discord ?????????????????? Discord",
                    }),
            ],
            ephemeral: true,
        });
        let embed = new MessageEmbed()
            .setTitle(`???????????? - ????????????`)
            .setDescription(`???????????????????????????????????????`)
            .setFooter({
                iconURL: client.user.avatarURL({ dynamic: true }),
                text: "Suggestion Bot ??? ??? Discord ?????????????????? Discord",
            })
            .setColor("GREEN");

        let row = new MessageActionRow().addComponents(
            new MessageButton()
                .setCustomId("reactionCount")
                .setLabel("??????????????????")
                .setStyle("SECONDARY"),
            new MessageButton()
                .setCustomId("starboardChannel")
                .setLabel("??????????????????")
                .setStyle("SECONDARY"),
            new MessageButton()
                .setCustomId("enableStarboardSystem")
                .setLabel("??????????????????")
                .setStyle("SUCCESS")
        );
        interaction.message.edit({
            embeds: [embed],
            components: [row]
        });
    } else if (interaction.customId === "enableStarboardSystem") {
        starboardSchema.findOneAndUpdate(
            { GuildID: interaction.guild.id },
            {
                $set: {
                    Enabled: true,
                },
            },
            async (err, data) => {
                data.save();
            }
        );
        interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setDescription(
                        `<a:success:992779451052072984> | ?????????????????????`
                    )
                    .setColor(client.config.color.success)
                    .setFooter({
                        iconURL: client.user.avatarURL({ dynamic: true }),
                        text: "Suggestion Bot ??? ??? Discord ?????????????????? Discord",
                    }),
            ],
            ephemeral: true,
        });
        let embed = new MessageEmbed()
            .setTitle(`???????????? - ????????????`)
            .setDescription(`???????????????????????????????????????`)
            .setFooter({
                iconURL: client.user.avatarURL({ dynamic: true }),
                text: "Suggestion Bot ??? ??? Discord ?????????????????? Discord",
            })
            .setColor("GREEN");

        let row = new MessageActionRow().addComponents(
            new MessageButton()
                .setCustomId("reactionCount")
                .setLabel("??????????????????")
                .setStyle("SECONDARY"),
            new MessageButton()
                .setCustomId("starboardChannel")
                .setLabel("??????????????????")
                .setStyle("SECONDARY"),
            new MessageButton()
                .setCustomId("disableStarboardSystem")
                .setLabel("??????????????????")
                .setStyle("DANGER")
        );
        interaction.message.edit({
            embeds: [embed],
            components: [row]
        });
    } else if (interaction.customId === "starboardChannel") {
        const channelRow = new MessageActionRow()   
            .addComponents(
                new MessageSelectMenu()
                    .setCustomId("changeStarboardChannel")
                    .setPlaceholder('????????????'),
            )
        const controlRow = new MessageActionRow()
            .addComponents(
                new MessageButton()
                .setCustomId('setChannelID')
                .setLabel(`?????????????????? ID`)
                .setStyle("PRIMARY")
            )
        interaction.guild.channels.cache.first(24).forEach((ch) => {
            channelRow.components[0].addOptions([
                {
                    label: `${ch.name}`,
                    value: `${ch.id}`
                }
            ])
        })

        interaction.reply({ components: [controlRow], ephemeral: true })
    } else if (interaction.customId === "setChannelID") {
        const modal = new Modal()
            .setCustomId('setChannelIDModal')
            .setTitle('??????????????????')
        const channelInput = new TextInputComponent()
            .setCustomId('newStarBoardChannelID')
            .setLabel("?????? ID")
            .setStyle("SHORT")
            .setMinLength(18)
            .setMaxLength(18)
            .setRequired(true)
        const setChannelActionRow = new MessageActionRow()
            .addComponents(channelInput)
        modal.addComponents(setChannelActionRow)
        interaction.showModal(modal)
    }
});

client.on("interactionCreate", (interaction) => {
    if (!interaction.isModalSubmit()) return;

    if (interaction.customId === "reactionCountModal") {
        starboardSchema.findOneAndUpdate(
            { GuildID: interaction.guild.id },
            {
                $set: {
                    Count: parseInt(
                        interaction.fields.getTextInputValue(
                            "reactionCountNumber"
                        )
                    ),
                },
            },
            async (err, data) => {
                data.save();
            }
        );
        interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setDescription(
                        `<a:success:992779451052072984> | ?????????????????????`
                    )
                    .setColor(client.config.color.success)
                    .setFooter({
                        iconURL: client.user.avatarURL({ dynamic: true }),
                        text: "Suggestion Bot ??? ??? Discord ?????????????????? Discord",
                    }),
            ],
            ephemeral: true,
        });
    } else if (interaction.customId === "setChannelIDModal") {
        const newChannelID = interaction.fields.getTextInputValue("newStarBoardChannelID");
        let checkChannel = interaction.guild.channels.cache.get(newChannelID);

        if(!checkChannel) return interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setDescription(`<:error:993839059774492692> | ?????????????????????`)
                    .setColor(client.config.color.red)
                    .setFooter({
                        iconURL: client.user.avatarURL({ dynamic: true }),
                        text: "Suggestion Bot ??? ??? Discord ?????????????????? Discord",
                    })
            ],
            ephemeral: true
        })

        starboardSchema.findOneAndUpdate(
            { GuildID: interaction.guild.id },
            {
                $set: {
                    ChannelID:
                        interaction.fields.getTextInputValue(
                            "newStarBoardChannelID"
                        )
                },
            },
            async (err, data) => {
                data.save();
            }
        );

        return interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setDescription(
                        `<a:success:992779451052072984> | ?????????????????????`
                    )
                    .setColor(client.config.color.success)
                    .setFooter({
                        iconURL: client.user.avatarURL({ dynamic: true }),
                        text: "Suggestion Bot ??? ??? Discord ?????????????????? Discord",
                    }),
            ],
            ephemeral: true,
        }); 

    }
});
