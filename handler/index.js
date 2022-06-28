const { glob } = require("glob");
const { promisify } = require("util");
const { Client } = require("discord.js");
const client = require("../index");
const mongoose = require("mongoose");
const Discord = require("discord.js");
const globPromise = promisify(glob);
const path = require("path");
const { MessageEmbed, WebhookClient } = require('discord.js');
const webhookClient = new WebhookClient({
  url: client.config.webhook.error
});

module.exports = async (client) => {
  // Events
  const eventFiles = await globPromise(
    path.join(__dirname, `..`, `events/`, `*.js`)
  );
  eventFiles.map((value) => require(value));

  // Module
  const moduleFiles = await globPromise(
    path.join(__dirname, `..`, `module/`, `*.js`)
  );
  moduleFiles.map((value) => require(value));

  // Slash Commands
  const slashCommands = await globPromise(
    path.join(__dirname, `..`, `SlashCommands/`, `**`, `*.js`)
  );

  const arrayOfSlashCommands = [];
  slashCommands.map((value) => {
    const file = require(value);
    if (!file?.name) return;
    client.slashCommands.set(file.name, file);
    arrayOfSlashCommands.push(file);
  });

  client.on("messageCreate", async (message, user) => {
    if (message.content.startsWith(`${client.config.prefix}deploy`)) {
      try {
        if (!message.member.permissions.has("MANAGE_GUILD")) {
          return message.reply(`🔒 你沒有權限使用此指令！`);
        }
        let themsg = await message.reply(
          `**正在嘗試在 \`${message.guild.name}\` 中設置斜線指令...**`
        );
        await client.application.commands
          .set(arrayOfSlashCommands)
          .then((slashCommandsData) => {
            themsg.edit(
              `**成功在 ${message.guild.name} 加載\`${slashCommandsData.size} 斜線指令\`**`
            );
          })
          .catch((e) => {
            console.log(e);
            themsg.edit(
              `**我無法在 ${message.guild.name} 加載斜線指令**\n\n**我缺少了創建斜線指令的權限！ 用這個鏈接重新邀請我：**\n> https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot%20applications.commands`
            );
          });
      } catch (e) {
        console.log(String(e.stack));
        webhookClient.send({
          embeds: [
            new Discord.MessageEmbed()
              .setTitle("錯誤回報")
              .setDescription(
                `錯誤訊息：\`\`\`${e}\`\`\`指令：\`\`\`${client.config.prefix}deploy\`\`\`機器人：\`\`\`${client.user.tag} (${client.user.id})\`\`\``
              ),
          ],
        });
        return message.channel.send({
          embeds: [
            new Discord.MessageEmbed()
              .setColor(`RED`)
              .setTitle(`❌ 尷尬了！發生了錯誤！`)
              .setDescription(
                `這個錯誤不應該發生！ 這一定是程式錯誤！已自動回報給開發者`
              ),
          ],
        });
      }
    }
  });

  const joinWebhook = new WebhookClient({ url: client.config.webhook.join })
  const leaveWebhook = new WebhookClient({ url: client.config.webhook.leave })

 
  client.on("guildCreate", async (guild) => {
    let embed = new MessageEmbed()
      .setAuthor({ name: `${client.user.username}#${client.user.discriminator} | ${client.user.id}`, iconURL: client.user.displayAvatarURL()})
      .setDescription(`<:joins:956444030487642112> 我加入了 ${guild.name}！`)
      .setColor(client.config.color.grey)
    joinWebhook.send({
      embeds: [embed]
    })
    await client.application.commands.set(arrayOfSlashCommands);
    return console.log(
      `⚡ 我被邀請加入 ${guild.name}！ 我現在將開始創建 / 指令（如果我有權限）`
    )
  });
  client.on("guildDelete", async (guild) => {
    let embed = new MessageEmbed()
      .setAuthor({ name: `${client.user.username}#${client.user.discriminator} | ${client.user.id}`, iconURL: client.user.displayAvatarURL()})
      .setDescription(`<:leaves:956444050792280084> 我離開了 ${guild.name}！`)
      .setColor(client.config.color.grey)
    leaveWebhook.send({
      embeds: [embed]
    })
  });

  mongoose
    .connect(client.config.mongooseConnectionString, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    })
    .then(console.log(`🏆 正在加載 MONGO 數據庫`));
};
