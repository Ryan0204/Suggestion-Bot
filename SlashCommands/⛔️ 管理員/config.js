const {
    Client,
    CommandInteraction,
    MessageEmbed,
    MessageActionRow,
    MessageButton,
} = require("discord.js");
const client = require("../..");
var validateColor = require("validate-color").default;
const suggestionSchema = require('../../schema/suggestionSettings');
module.exports = {
    name: "config",
    description: "設定機器人",
    type: "CHAT_INPUT",
    applicationId: "1010195913316237383",
    options: [
        {
            name: "suggestion",
            description: "設定許願系統",
            type: "SUB_COMMAND_GROUP",
            options: [
                {
                    name: "theme",
                    description: "設定許願系統主題",
                    type: "SUB_COMMAND",
                    options: [
                        {
                            name: "初始顏色",
                            description: "輸入初始顏色(支持色碼)",
                            type: "STRING",
                            required: false,
                        },
                        {
                            name: "同意顏色",
                            description: "輸入同意的顏色(支持色碼)",
                            type: "STRING",
                            required: false,
                        },
                        {
                            name: "不同意顏色",
                            description: "輸入不同意的顏色(支持色碼)",
                            type: "STRING",
                            required: false,
                        },
                        {
                            name: "考慮顏色",
                            description: "輸入考慮的顏色(支持色碼)",
                            type: "STRING",
                            required: false,
                        },
                    ],
                },
                {
                    name: "mention",
                    description: "設定許願系統標注",
                    type: "SUB_COMMAND",
                    options: [
                        {
                            name: "role",
                            description: "設定許願系統標注身份組",
                            type: "ROLE",
                            require: true,
                        }
                    ]
                },
                {
                    name: "thread",
                    description: "設定許願系統是否自動開啟討論串",
                    type: "SUB_COMMAND",
                }
            ],
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
        const subCommandGroup = interaction.options.getSubcommandGroup();
        const subCommand = interaction.options.getSubcommand();
        const data = await suggestionSchema.findOne({ GuildID: interaction.guild.id });
        if (subCommandGroup === "suggestion") {
            if (subCommand === "theme") {
                let selected = false;
                if (interaction.options.getString("初始顏色")) {
                    let value = interaction.options.getString("初始顏色");
                    selected = true;
                    if (!validateColor(value))
                        return interaction.editReply({ embeds: [error("我只支持色碼！")]});
                }
                if (interaction.options.getString("同意顏色")) {
                    selected = true;
                    let value = interaction.options.getString("同意顏色");
                    if (!validateColor(value))
                        return interaction.editReply({ embeds: [error("我只支持色碼！")]});
                }
                if (interaction.options.getString("不同意顏色")) {
                    selected = true;
                    let value = interaction.options.getString("不同意顏色");
                    if (!validateColor(value))
                        return interaction.editReply({ embeds: [error("我只支持色碼！")]});
                }
                if (interaction.options.getString("考慮顏色")) {
                    selected = true;
                    let value = interaction.options.getString("考慮顏色");
                    if (!validateColor(value))
                        return interaction.editReply({ embeds: [error("我只支持色碼！")]});
                }
                if (!selected) return interaction.editReply({ embeds: [error("請選擇一個選項！")]});
                if (interaction.options.getString("初始顏色")) {
                    let value = interaction.options.getString("初始顏色");
                    if (!data) {
                        suggestionSchema({
                            GuildID: interaction.guild.id,
                            EmbedColorDefault: value,
                        }).save()
                    } else {
                        suggestionSchema.findOneAndUpdate(
                            {
                                GuildID: interaction.guild.id,
                            },
                            {
                                $set: {
                                    EmbedColorDefault: value,
                                },
                            }, async(err, data) => {
                                await data.save();
                            }
                        )
                    }
                }
                if (interaction.options.getString("同意顏色")) {
                    let value = interaction.options.getString("同意顏色");
                    if (!data) {
                        suggestionSchema({
                            GuildID: interaction.guild.id,
                            EmbedColorAccept: value,
                        }).save()
                    } else {
                        suggestionSchema.findOneAndUpdate(
                            {
                                GuildID: interaction.guild.id,
                            },
                            {
                                $set: {
                                    EmbedColorAccept: value,
                                },
                            }, async(err, data) => {
                                await data.save();
                            }
                        )
                    }
                }
                if (interaction.options.getString("不同意顏色")) {
                    let value = interaction.options.getString("不同意顏色");
                    if (!data) {
                        suggestionSchema({
                            GuildID: interaction.guild.id,
                            EmbedColorDecline: value,
                        }).save()
                    } else {
                        suggestionSchema.findOneAndUpdate(
                            {
                                GuildID: interaction.guild.id,
                            },
                            {
                                $set: {
                                    EmbedColorDecline: value,
                                },
                            }, async(err, data) => {
                                await data.save();
                            }
                        )
                    }
                }
                if (interaction.options.getString("考慮顏色")) {
                    let value = interaction.options.getString("考慮顏色");
                    if (!data) {
                        suggestionSchema({
                            GuildID: interaction.guild.id,
                            EmbedColorIdk: value,
                        }).save()
                    } else {
                        suggestionSchema.findOneAndUpdate(
                            {
                                GuildID: interaction.guild.id,
                            },
                            {
                                $set: {
                                    EmbedColorIdk: value,
                                },
                            }, async(err, data) => {
                                await data.save();
                            }
                        )
                    }
                }
                interaction.editReply({ embeds: [updated()] });
            } else if (subCommand === "mention") {
                let role = interaction.options.getRole("role");
                if (!role) return interaction.editReply({ embeds:  [error("請選擇身份組!")] });
                if (!data) {
                    suggestionSchema({
                        GuildID: interaction.guild.id,
                        MentionRole: role.id,
                    }).save()
                } else {
                    suggestionSchema.findOneAndUpdate(
                        {
                            GuildID: interaction.guild.id,
                        },
                        {
                            $set: {
                                Mention: role.id,
                            },
                        }, async(err, data) => {
                            await data.save();
                        }
                    )
                }
                interaction.editReply({ embeds: [updated()] });
            } else if (subCommand === "thread") {
                let enabled = false;
                if (data && data.Thread) enabled = data.Thread;

                if (!data) {
                    suggestionSchema({
                        GuildID: interaction.guild.id,
                        Thread: true,
                    }).save()
                } else {
                    suggestionSchema.findOneAndUpdate(
                        {
                            GuildID: interaction.guild.id,
                        },
                        {
                            $set: {
                                Thread: !enabled,
                            },
                        }, async(err, data) => {
                            await data.save();
                        }
                    )
                }
                interaction.editReply({ embeds: [updated(` 已\`${!enabled ? "啟用" : "停用"}\`自動開啟討論串 `) ] });
            }
        }
    },
};


function error(message) {
    return new MessageEmbed()
        .setColor(client.config.color.red)
        .setAuthor({ iconURL: client.config.icon.error, name: "發生了錯誤"})
        .setDescription(message)
        .setFooter({ text: client.config.footer.text, iconURL: client.config.footer.icon })
}

function updated(message) {
    let embed = new MessageEmbed();
    embed.setColor(client.config.color.success)
    embed.setAuthor({ iconURL: client.config.icon.success, name: "成功更新"})
    if (message) embed.setDescription(message)
    embed.setFooter({ text: client.config.footer.text, iconURL: client.config.footer.icon })
    return embed;
}