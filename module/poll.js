const client = require("..");
const pollSchema = require("../schema/poll");
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const {
    ChartJSNodeCanvas,
    ChartConfiguration,
} = require("chartjs-node-canvas");
const { MessageAttachment, MessageEmbed } = require("discord.js");

const width = 800;
const height = 600;

client.on("interactionCreate", async (interaction) => {
    const endedEmbed = new MessageEmbed()
        .setTitle("❌ | 投票已被終止了")
        .setColor("RED")
        .setFooter({
            iconURL: client.user.avatarURL({ dynamic: true }),
            text: "Suggestion Bot ∙ 將 Discord 變成不一樣的 Discord",
        })
        
    if (interaction.isSelectMenu()) {
        const checkEnded = await pollSchema.findOne({ MessageID: interaction.message.id });
        let messageId = interaction.message.id;
        let data = await pollSchema.findOne({ MessageID: messageId });
        if (interaction.customId === "control") {
            const value = interaction.values[0];

            if (value === "visible") {
                let newPublic = false;
                if (data.Public === false) newPublic = true;
                pollSchema.findOneAndUpdate(
                    { MessageID: messageId },
                    { $set: { Public: newPublic }},
                    async (err, data) => {
                        await data.save()
                    }
                );
                if (interaction.user.id != data.OwnerID) return interaction.reply({
                    embeds: [
                        new MessageEmbed()
                            .setTitle('❌ | 你不是投票的建立者')
                            .setFooter({
                                iconURL: client.user.avatarURL({ dynamic: true }),
                                text: "Suggestion Bot ∙ 將 Discord 變成不一樣的 Discord",
                            })
                            .setColor("RED")
                    ],
                    ephemeral: true
                })
                let textPublic = "公開";
                if (newPublic === false) textPublic = "不公開"
                interaction.reply({ embeds: [
                    new MessageEmbed()
                        .setTitle(`✅ | 投票設定為${textPublic}`)
                        .setFooter({
                            iconURL: client.user.avatarURL({ dynamic: true }),
                            text: "Suggestion Bot ∙ 將 Discord 變成不一樣的 Discord",
                        })
                        .setColor("GREEN")
                ], ephemeral: true})
            } if (value === "end") {
                if (checkEnded.Ended === true) return interaction.reply({
                    embeds: [endedEmbed],
                    ephemeral: true
                })

                pollSchema.findOneAndUpdate({
                    MessageID: interaction.message.id
                }, {
                    $set: {
                        Ended: true,
                    }
                }, async(err, data) => {
                    await data.save();
                })
                interaction.reply({ embeds: [
                    new MessageEmbed()
                        .setTitle("❌ | 投票已被終止")
                        .setColor("RED")
                        .setFooter({
                            iconURL: client.user.avatarURL({ dynamic: true }),
                            text: "Suggestion Bot ∙ 將 Discord 變成不一樣的 Discord",
                        })
                ], ephemeral: true })
            }
        }
    }


    if (interaction.type === "APPLICATION_COMMAND") return;
    if (interaction.isButton) {
        if (interaction.customId.startsWith("Option")) {
            let messageId = interaction.message.id;

            const checkEnded = await pollSchema.findOne({ MessageID: messageId });
            if (checkEnded.Ended === true) return interaction.reply({
                embeds: [endedEmbed],
                ephemeral: true
            })

            // PULL SCHEMA
            pollSchema.findOneAndUpdate(
                { MessageID: messageId },
                { $pull: { Option1: `<@${interaction.user.id}>` } },
                async (err, data) => {
                    data.save();
                }
            );
            pollSchema.findOneAndUpdate(
                { MessageID: messageId },
                { $pull: { Option2: `<@${interaction.user.id}>` } },
                async (err, data) => {
                    data.save();
                }
            );
            pollSchema.findOneAndUpdate(
                { MessageID: messageId },
                { $pull: { Option3: `<@${interaction.user.id}>` } },
                async (err, data) => {
                    data.save();
                }
            );
            pollSchema.findOneAndUpdate(
                { MessageID: messageId },
                { $pull: { Option4: `<@${interaction.user.id}>` } },
                async (err, data) => {
                    data.save();
                }
            );
            pollSchema.findOneAndUpdate(
                { MessageID: messageId },
                { $pull: { Option5: `<@${interaction.user.id}>` } },
                async (err, data) => {
                    data.save();
                }
            );
            pollSchema.findOneAndUpdate(
                { MessageID: messageId },
                { $pull: { Option6: `<@${interaction.user.id}>` } },
                async (err, data) => {
                    data.save();
                }
            );
            pollSchema.findOneAndUpdate(
                { MessageID: messageId },
                { $pull: { Option7: `<@${interaction.user.id}>` } },
                async (err, data) => {
                    data.save();
                }
            );
            pollSchema.findOneAndUpdate(
                { MessageID: messageId },
                { $pull: { Option8: `<@${interaction.user.id}>` } },
                async (err, data) => {
                    data.save();
                }
            );
            pollSchema.findOneAndUpdate(
                { MessageID: messageId },
                { $pull: { Option9: `<@${interaction.user.id}>` } },
                async (err, data) => {
                    data.save();
                }
            );
            pollSchema.findOneAndUpdate(
                { MessageID: messageId },
                { $pull: { Option10: `<@${interaction.user.id}>` } },
                async (err, data) => {
                    data.save();
                }
            );
            let option = interaction.customId;
            pollSchema.findOneAndUpdate(
                { MessageID: messageId },
                {
                    $push: {
                        [`${option}`]: `<@${interaction.user.id}>`,
                    },
                },
                async (err, data) => {
                    data.save();
                }
            );
            interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setTitle("✅ | 投票完成")
                        .setDescription(
                            `你投給了 \`${interaction.component.label}\``
                        )
                        .setColor("GREEN"),
                ],
                ephemeral: true,
            });
    
            await delay(200);
    
            const data = await pollSchema.findOne({
                MessageID: interaction.message.id,
            });
    
            let count =
                data.Option1.length +
                data.Option2.length +
                data.Option3.length +
                data.Option4.length +
                data.Option5.length +
                data.Option6.length +
                data.Option7.length +
                data.Option8.length +
                data.Option9.length +
                data.Option10.length;
    
            let members;
            if(interaction.guild.members.cache.size === interaction.guild.memberCount) members = interaction.guild.members.cache.filter(member => !member.user.bot).size;
            else members = (await interaction.guild.members.fetch()).filter(member => !member.user.bot).size;
        
            const user = client.users.cache.get(data.OwnerID);
            let embed = new MessageEmbed()
                .setAuthor({ name: "📖 | 投票" })
                .setTitle(data.Title)
                .setDescription(
                    `總投票數: ${count} / ${members} | 參與率: ${(
                        (+count /
                            +members) *
                        100
                    ).toFixed(1)}%`
                )
                .setFooter({
                    text: `${user.username} 發起了投票`,
                    iconURL: user.avatarURL({ dynamic: true }),
                })
                .setColor("RANDOM");
    
            interaction.message.edit({ embeds: [embed] });
        } else if (interaction.customId === "showChart") {
            const data = await pollSchema.findOne({
                MessageID: interaction.message.id,
            });
            if (data.Public != true && interaction.user.id != data.OwnerID)
                return interaction.reply({
                    embeds: [
                        new MessageEmbed()
                            .setTitle("❌ | 這個投票不是公開的")
                            .setDescription(
                                "只有發起人能查看結果，如果要公開可以點擊下面選單的 `公開投票結果`"
                            )
                            .setFooter({
                                iconURL: client.user.avatarURL({ dynamic: true }),
                                text: "Suggestion Bot ∙ 將 Discord 變成不一樣的 Discord",
                            })
                            .setColor("RED"),
                    ],
                    ephemeral: true,
                });
            const canvas = new ChartJSNodeCanvas({
                width,
                height,
                backgroundColour: "rgb(45 47 51)",
            });
            canvas.registerFont(`${process.cwd()}/fonts/NotoSansTC-Regular.otf`, {
                family: "NotoSansTC",
            });
    
            const configuration = {
                type: "pie",
                options: {
                    plugins: {
                        legend: {
                            labels: {
                                font: {
                                    size: 32,
                                    family: "'Noto Sans TC', sans-serif",
                                },
                            },
                        },
                        labels: {
                            render: "value",
                            fontSize: 28,
                            fontStyle: "bold",
                            fontColor: "#FFF",
                            fontFamily: '"Lucida Console", Monaco, monospace',
                        },
                    },
                },
                data: {
                    labels: data.Options,
                    datasets: [
                        {
                            label: "My First Dataset",
                            data: [
                                data.Option1.length,
                                data.Option2.length,
                                data.Option3.length,
                                data.Option4.length,
                                data.Option5.length,
                                data.Option6.length,
                                data.Option7.length,
                                data.Option8.length,
                                data.Option9.length,
                                data.Option10.length,
                            ],
                            backgroundColor: [
                                "#ED5565",
                                "#FFCE54",
                                "#48CFAD",
                                "#5D9CEC",
                                "#EC87CD",
                                "#FC6E51",
                                "#A0D468",
                            ],
                        },
                    ],
                },
            };
    
            const image = await canvas.renderToBuffer(configuration);
            const attachment = new MessageAttachment(image);
    
            // Get number of how many people joined
            let count =
                +data.Option1.length +
                +data.Option2.length +
                +data.Option3.length +
                +data.Option4.length +
                +data.Option5.length +
                +data.Option6.length +
                +data.Option7.length +
                +data.Option8.length +
                +data.Option9.length +
                +data.Option10.length;
            const options = [];
            let fieldData = new Object();
            if (data.Option1.length != 0) {
                fieldData = {
                    name: `${data.Options[0]} (共 ${data.Option1.length} 人 ${(
                        (+data.Option1.length / +count) *
                        100
                    ).toFixed(1)}%)`,
                    value: `${data.Option1.join("\n")}`,
                };
                options.push(fieldData);
            }
            if (data.Option2.length != 0) {
                fieldData = {
                    name: `${data.Options[1]} (共 ${data.Option2.length} 人 ${(
                        (+data.Option2.length / +count) *
                        100
                    ).toFixed(1)}%)`,
                    value: `${data.Option2.join("\n")}`,
                };
                options.push(fieldData);
            }
            if (data.Option3.length != 0) {
                fieldData = {
                    name: `${data.Options[2]} (共 ${data.Option3.length} 人 ${(
                        (+data.Option3.length / +count) *
                        100
                    ).toFixed(1)}%)`,
                    value: `${data.Option3.join("\n")}`,
                };
                options.push(fieldData);
            }
            if (data.Option4.length != 0) {
                fieldData = {
                    name: `${data.Options[3]} (共 ${data.Option4.length} 人 ${(
                        (+data.Option4.length / +count) *
                        100
                    ).toFixed(1)}%)`,
                    value: `${data.Option4.join("\n")}`,
                };
                options.push(fieldData);
            }
            if (data.Option5.length != 0) {
                fieldData = {
                    name: `${data.Options[4]} (共 ${data.Option5.length} 人 ${(
                        (+data.Option5.length / +count) *
                        100
                    ).toFixed(1)}%)`,
                    value: `${data.Option5.join("\n")}`,
                };
                options.push(fieldData);
            }
            if (data.Option6.length != 0) {
                fieldData = {
                    name: `${data.Options[5]} (共 ${data.Option6.length} 人 ${(
                        (+data.Option6.length / +count) *
                        100
                    ).toFixed(1)}%)`,
                    value: `${data.Option6.join("\n")}`,
                };
                options.push(fieldData);
            }
            if (data.Option7.length != 0) {
                fieldData = {
                    name: `${data.Options[6]} (共 ${data.Option7.length} 人 ${(
                        (+data.Option7.length / +count) *
                        100
                    ).toFixed(1)}%)`,
                    value: `${data.Option7.join("\n")}`,
                };
                options.push(fieldData);
            }
            if (data.Option8.length != 0) {
                fieldData = {
                    name: `${data.Options[7]} (共 ${data.Option8.length} 人 ${(
                        (+data.Option8.length / +count) *
                        100
                    ).toFixed(1)}%)`,
                    value: `${data.Option8.join("\n")}`,
                };
                options.push(fieldData);
            }
            if (data.Option9.length != 0) {
                fieldData = {
                    name: `${data.Options[8]} (共 ${data.Option9.length} 人 ${(
                        (+data.Option9.length / +count) *
                        100
                    ).toFixed(1)}%)`,
                    value: `${data.Option9.join("\n")}`,
                };
                options.push(fieldData);
            }
    
            const statusEmbed = new MessageEmbed()
                .setTitle(data.Title)
                .addFields(options)
                .setColor("GREEN")
                .setImage("attachment://file.jpg");
            interaction.reply({
                embeds: [statusEmbed],
                files: [attachment],
                ephemeral: true,
            });
        }
    }  
});
