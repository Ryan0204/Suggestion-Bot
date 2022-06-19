const { Client, Collection } = require("discord.js");
const colors = require("colors");
const client = new Client({
  intents: 130813,
});
module.exports = client;

// Global Variables
client.commands = new Collection();
client.slashCommands = new Collection();
client.config = require("./config.json");

// Initializing the project
require("./handler")(client);

// stop and restart
const glob = require("glob");
const fetch = require(`node-fetch`);
client.on("interactionCreate", async (btn) => {
  if (btn.values == "stop_client") {
    if (!client.config.developers.includes(btn.member.id))
      return btn.reply({
        content: "🔒 你沒有權限使用！",
        ephemeral: true,
      });
    try {
      btn.reply({
        content: "<a:Loading:920516789883002880> **正在關閉機器人...**",
        ephemeral: true,
      });
      setTimeout(() => {
        process.exit();
      }, 5000);
    } catch (e) {
      btn.editReply({
        content: `${e}`,
      });
    }
  }
  if (btn.values == "rename_client") {
    if (!client.config.developers.includes(btn.member.id))
      return btn.reply({
        content: "🔒 你沒有權限使用！",
        ephemeral: true,
      });
    let filter = (m) => m.author.id === btn.user.id;
    const collector = btn.channel.createMessageCollector({
      filter,
      max: 1,
    });
    btn.reply({
      content: "<a:Loading:920516789883002880> **請輸入新的名字**",
      ephemeral: true,
    });
    /* collector.on("collect", async(msg) => {
      
    }) */ //not needed
    collector.on("end", (collected) => {
      const name = collected.first().content;
      if (!name) {
        return btn.reditReply({ content: `❌ **沒有收到新名字！**` });
      }
      let beforename = client.user.username;
      client.user
        .setUsername(name)
        .then((user) => {
          collected.delete();
          btn.editReply({
            content: `✅ **成功將名稱從 ${beforename} 設置為 ${client.user.username}**`,
            ephemeral: true,
          });
        })
        .catch((e) => {
          btn.editReply({ content: `${e}`, ephemeral: true });
        });
    });
  }
  if (btn.values == "changeav_client") {
    if (!client.config.developers.includes(btn.member.id))
      return btn.reply({
        content: "🔒 你沒有權限使用！",
        ephemeral: true,
      });
    let filter = (m) => m.author.id === btn.user.id;
    const collector = btn.channel.createMessageCollector({
      filter,
      max: 1,
    });
    btn.reply({
      content: "<a:Loading:920516789883002880> **請發送新的機器人圖像鏈結**",
      ephemeral: true,
    });
    collector.on("collect", async (msg) => {
      let url = msg.content;
      if (msg.content.includes(`https://`)) {
        btn.editReply({
          content: "<a:Loading:920516789883002880> **正在更換頭像...**",
          ephemeral: true,
        });

        await msg.delete();
        client.user
          .setAvatar(url)
          .then((user) => {
            btn.editReply({
              content: "✅ **成功更換機器人頭像！**",
              ephemeral: true,
            });
          })
          .catch((e) => {
            btn.editReply({ content: `${e}`, ephemeral: true });
          });
      } else {
        msg.delete();
        btn.editReply({ content: "❌ 不是有效的鏈結", ephemeral: true });
      }
    });
  }
});

client.login(client.config.token);

/*           ANTI CRASHING            ¦¦           ANTI CRASHING           */
process.on("unhandledRejection", (reason, p) => {
  console.log(
    "\n\n\n\n\n[🚩 Anti-Crash] unhandled Rejection:".toUpperCase().red.dim
  );
  console.log(
    reason.stack.yellow.dim
      ? String(reason.stack).yellow.dim
      : String(reason).yellow.dim
  );
  console.log("=== unhandled Rejection ===\n\n\n\n\n".toUpperCase().red.dim);
});
process.on("uncaughtException", (err, origin) => {
  console.log(
    "\n\n\n\n\n\n[🚩 Anti-Crash] uncaught Exception".toUpperCase().red.dim
  );
  console.log(err.stack.yellow.dim ? err.stack.yellow.dim : err.yellow.dim);
  console.log("=== uncaught Exception ===\n\n\n\n\n".toUpperCase().red.dim);
});
process.on("uncaughtExceptionMonitor", (err, origin) => {
  console.log(
    "[🚩 Anti-Crash] uncaught Exception Monitor".toUpperCase().red.dim
  );
});
process.on("beforeExit", (code) => {
  console.log("\n\n\n\n\n[🚩 Anti-Crash] before Exit".toUpperCase().red.dim);
  console.log(code.yellow.dim);
  console.log("=== before Exit ===\n\n\n\n\n".toUpperCase().red.dim);
});
process.on("exit", (code) => {
  console.log("\n\n\n\n\n[🚩 Anti-Crash] exit".toUpperCase().red.dim);
  console.log(code.yellow.dim);
  console.log("=== exit ===\n\n\n\n\n".toUpperCase().red.dim);
});
process.on("multipleResolves", (type, promise, reason) => {
  console.log(
    "\n\n\n\n\n[🚩 Anti-Crash] multiple Resolves".toUpperCase().red.dim
  );
  console.log(type, promise, reason.yellow.dim);
  console.log("=== multiple Resolves ===\n\n\n\n\n".toUpperCase().red.dim);
});
