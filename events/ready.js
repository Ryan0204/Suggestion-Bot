const { green, magenta, cyan } = require("chalk");
const { type } = require("os");
const client = require("../index");

client.on("ready", () => {
  console.log(cyan.bold(`🪐 OuO Development`));
  console.log(
    green(`[🚩機器人] → ` + magenta(`${client.user.tag}`) + ` 已準備就緒！`)
  );
  console.log(
    green(
      `[🚩機器人] → https://discord.com/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot%20applications.commands`
    )
  );
  client.user.setActivity(client.config.activity, {type: client.config.present});
  client.user.setStatus(client.config.status);
});
