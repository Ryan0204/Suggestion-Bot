const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const config = require("../../config.json");
module.exports = {
<<<<<<< HEAD
    name: "ping",
    description: "獲取機器人信息",
    type: "CHAT_INPUT",
    applicationId: "955420795201544225",
=======
  name: "ping",
  description: "獲取機器人信息",
  type: "CHAT_INPUT",
  run: async (client, interaction, args) => {
    // Uptime Checker
    let totalSeconds = client.uptime / 1000;
    let days = Math.floor(totalSeconds / 86400);
    totalSeconds %= 86400;
    let hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = Math.floor(totalSeconds % 60);
>>>>>>> parent of 557e18a (✨ | 小更新)

    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {
        // Uptime Checker
        let totalSeconds = client.uptime / 1000;
        let days = Math.floor(totalSeconds / 86400);
        totalSeconds %= 86400;
        let hours = Math.floor(totalSeconds / 3600);
        totalSeconds %= 3600;
        let minutes = Math.floor(totalSeconds / 60);
        let seconds = Math.floor(totalSeconds % 60);

        let newm;
        if (minutes == 0) {
            newm = `${seconds}s`;
        } else if (hours == 0) {
            newm = `${minutes}m & ${seconds}s`;
        } else if (days == 0) {
            newm = `${hours}h, ${minutes}m & ${seconds}s`;
        } else {
            newm = `${days}d, ${hours}h, ${minutes}m & ${seconds}s`;
        }
        receiveBotInfo = async () => {
            function format(seconds) {
                function pad(s) {
                    return (s < 10 ? "0" : "") + s;
                }
                var hours = Math.floor(seconds / (60 * 60));
                var minutes = Math.floor((seconds % (60 * 60)) / 60);
                var seconds = Math.floor(seconds % 60);
                return (
                    pad(hours) + "h" + pad(minutes) + "m" + pad(seconds) + "s"
                );
            }
            const cluster = client.cluster.id;
            const shards = client.cluster.ids.map((d) => `${d.id}`).join(", ");
            const guild = client.guilds.cache.size;
            const members = client.guilds.cache.reduce(
                (acc, guild) => acc + guild.memberCount,
                0
            );
            const ram = (process.memoryUsage().heapTotal / 1024 / 1024).toFixed(
                0
            );
            const rssRam = (process.memoryUsage().rss / 1024 / 1024).toFixed(0);
            const ping = client.ws.ping;
            const uptime = format(process.uptime());
            return {
                cluster,
                shards,
                guild,
                members,
                ram,
                rssRam,
                ping,
                uptime,
            };
        };

        client.cluster
            .broadcastEval(`this.guilds.cache.size`)
            .then((results) =>
                console.log(
                    `${results.reduce(
                        (prev, val) => prev + val,
                        0
                    )} total guilds`
                )
            );

        const embed = new MessageEmbed()
            .setTitle(`${client.user.tag} • 邀請`)
            .setURL(
                `https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=139586825281&scope=bot%20applications.commands`
            )
            // .addFields(
            //     {
            //         name: "🏓 **延遲**",
            //         value: `​ ┕ \`${Math.round(client.ws.ping)}ms\``,
            //         inline: true,
            //     },
            //     {
            //         name: "🕐 **上線時間**",
            //         value: `​ ┕ \`${newm}\``,
            //         inline: true,
            //     },
            //     {
            //         name: "💻 **記憶體使用率**",
            //         value: `​ ┕ \`${Math.round(
            //             process.memoryUsage().heapUsed / 1024 / 1024
            //         )}mb\``,
            //         inline: true,
            //     },
            //     {
            //         name: "🏘️ **伺服器**",
            //         value: `​ ┕ \`${client.guilds.cache.size}\``,
            //         inline: true,
            //     },
            //     {
            //         name: "👥 **用戶**",
            //         value: `​ ┕ \`${client.guilds.cache.reduce(
            //             (acc, guild) => acc + guild.memberCount,
            //             0
            //         )}\``,
            //         inline: true,
            //     },
            //     {
            //         name: "🇨🇭 **頻道**",
            //         value: `​ ┕ \`${client.channels.cache.size}\``,
            //         inline: true,
            //     }
            // )
            .setFooter({ text: "此機器人由 Ryan 製作" })
            .setColor(config.color.grey);
        interaction.followUp({ embeds: [embed] });
    },
};
