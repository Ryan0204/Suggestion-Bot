const client = require("../index");
const Sugesstion = require(`../schema/suggest`);
const {
  MessageEmbed,
  MessageButton,
  MessageActionRow,
  MessageAttachment,
} = require("discord.js");
const config = client.config;
const suggestSchema = require("../schema/suggest");
const channelSchema = require("../schema/suggestChannel");
const constom_message = require("../schema/constomMessage");

client.on("messageCreate", async (message) => {
  if (!message.guild) return;
  channelSchema.findOne({ ChannelID: message.channel.id }, async (err, data) => {
    constom_message.findOne({ GuildID: message.guild.id },async (err, data1) => {
    if (!data) return;
    if (message.channel.id !== data.ChannelID || message.author.bot) return;
    SendInChannel();
    function SendInChannel() {
      const channel = data.ChannelID;
      if (!channel) return;
      let files = null;
      //add images if added (no videos possible)
      if (message.attachments.size > 0) {
        if (message.attachments.every(attachIsImage)) {
          files = url;
        }
      }

      function attachIsImage(msgAttach) {
        url = msgAttach.url || null;
        imagename = msgAttach.name || `Unknown`;
        return (
          url.indexOf(`png`, url.length - 3) !== -1 ||
          url.indexOf(`jpeg`, url.length - 4) !== -1 ||
          url.indexOf(`gif`, url.length - 3) !== -1 ||
          url.indexOf(`jpg`, url.length - 3) !== -1
        );
      }
      message.delete();
      client.channels.cache
        .get(data.ChannelID)
        .send({
          content: data1 ? data1.Mention ? data1.Mention : null : null,
          embeds: [
            new MessageEmbed()
              .setAuthor({
                name: `${message.author.tag} 的提議`,
                iconURL: message.author.displayAvatarURL({ dynamic: true }),
                url: 'https://discord.gg/HAN45Zaknr',
              })
              .setThumbnail(
                `${message.author.displayAvatarURL({ dynamic: true })}`
              )
              .setDescription(
                `>>> ${message.content || `\`沒有訊息  (≧д≦ヾ)\``}`
              )
              .addFields([
                { name: "👍 **__贊成__:**", value: "```0 票```", inline: true },
                { name: "👎 **__反對__:**", value: "```0 票```", inline: true },
              ])
              .setImage(files)
              .setFooter({
                text: "想建議/反饋？ 只需輸入在此頻道！",
                iconURL: `${client.user.displayAvatarURL()}`,
              })
              .setColor(data1 ? data1.EmbedColorDefault ? data1.EmbedColorDefault : config.color.blue : config.color.blue),
          ],
          components: [
            new MessageActionRow().addComponents(
              new MessageButton()
                .setLabel(`0`)
                .setEmoji("👍")
                .setCustomId("vote")
                .setStyle("SECONDARY"),
              new MessageButton()
                .setLabel(`0`)
                .setEmoji("👎")
                .setCustomId("unvote")
                .setStyle("SECONDARY"),
              new MessageButton()
                .setEmoji("❓")
                .setLabel("誰投票了？")
                .setStyle("PRIMARY")
                .setCustomId("who_voted")
            ),
          ],
        })
        .then((m) => {
          new suggestSchema({ MessageId: m.id }).save();
        });
    }
  });
})});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isButton()) return;
  switch (interaction.customId) {
    case "vote":
      {
        const voted2 = await AlreadyDownVoted(
          interaction.message.id,
          interaction.user.id
        );
        if (voted2) {
          let upvotes = parseInt(
            interaction.message.embeds[0].fields[0].value
              .split(" 票")
              .join("")
              .split("`")
              .join("")
          );
          let downvotes = parseInt(
            interaction.message.embeds[0].fields[1].value
              .split(" 票")
              .join("")
              .split("`")
              .join("")
          );
          upvotes++;
          downvotes--;
          const embed = interaction.message.embeds[0];
          embed.fields[0].key = "👍 **__贊成__:**";
          embed.fields[0].value = `\`\`\`${upvotes} 票\`\`\``;
          embed.fields[1].key = "👎 **__反對__:**";
          embed.fields[1].value = `\`\`\`${downvotes} 票\`\`\``;

          interaction.message.edit({
            embeds: [embed],
            components: [
              new MessageActionRow().addComponents(
                new MessageButton()
                  .setLabel(`${upvotes}`)
                  .setEmoji("👍")
                  .setCustomId("vote")
                  .setStyle("SECONDARY"),
                new MessageButton()
                  .setLabel(`${downvotes}`)
                  .setEmoji("👎")
                  .setCustomId("unvote")
                  .setStyle("SECONDARY"),
                new MessageButton()
                  .setEmoji("❓")
                  .setLabel("誰投票了？")
                  .setStyle("PRIMARY")
                  .setCustomId("who_voted")
              ),
            ],
          });
          await UpdateUpvotesDb(interaction.message.id, interaction.user);
          await RemoveDownvotesDb(interaction.message.id, interaction.user);
        }
        const voted = await AlreadyUpVoted(
          interaction.message.id,
          interaction.user.id
        );
        if (voted) return interaction.deferUpdate().catch(() => {});
        let upvotes = parseInt(
          interaction.message.embeds[0].fields[0].value
            .split(" 票")
            .join("")
            .split("`")
            .join("")
        );
        let downvotes = parseInt(
          interaction.message.embeds[0].fields[1].value
            .split(" 票")
            .join("")
            .split("`")
            .join("")
        );
        upvotes++;
        const embed = interaction.message.embeds[0];
        embed.fields[0].key = "👍 **__贊成__:**";
        embed.fields[0].value = `\`\`\`${upvotes} 票\`\`\``;
        embed.fields[1].key = "👎 **__反對__:**";
        embed.fields[1].value = `\`\`\`${downvotes} 票\`\`\``;

        interaction.message.edit({
          embeds: [embed],
          components: [
            new MessageActionRow().addComponents(
              new MessageButton()
                .setLabel(`${upvotes}`)
                .setEmoji("👍")
                .setCustomId("vote")
                .setStyle("SECONDARY"),
              new MessageButton()
                .setLabel(`${downvotes}`)
                .setEmoji("👎")
                .setCustomId("unvote")
                .setStyle("SECONDARY"),
              new MessageButton()
                .setEmoji("❓")
                .setLabel("誰投票了？")
                .setStyle("PRIMARY")
                .setCustomId("who_voted")
            ),
          ],
        });
        await UpdateUpvotesDb(interaction.message.id, interaction.user);
        interaction.deferUpdate().catch(() => {});
      }
      break;
    case "unvote":
      {
        const voted2 = await AlreadyUpVoted(
          interaction.message.id,
          interaction.user.id
        );
        if (voted2) {
          let upvotes = parseInt(
            interaction.message.embeds[0].fields[0].value
              .split(" 票")
              .join("")
              .split("`")
              .join("")
          );
          let downvotes = parseInt(
            interaction.message.embeds[0].fields[1].value
              .split(" 票")
              .join("")
              .split("`")
              .join("")
          );
          downvotes++;
          upvotes--;
          const embed = interaction.message.embeds[0];
          embed.fields[0].key = "👍 **__贊成__:**";
          embed.fields[0].value = `\`\`\`${upvotes} 票\`\`\``;
          embed.fields[1].key = "👎 **__反對__:**";
          embed.fields[1].value = `\`\`\`${downvotes} 票\`\`\``;

          interaction.message.edit({
            embeds: [embed],
            components: [
              new MessageActionRow().addComponents(
                new MessageButton()
                  .setLabel(`${upvotes}`)
                  .setEmoji("👍")
                  .setCustomId("vote")
                  .setStyle("SECONDARY"),
                new MessageButton()
                  .setLabel(`${downvotes}`)
                  .setEmoji("👎")
                  .setCustomId("unvote")
                  .setStyle("SECONDARY"),
                new MessageButton()
                  .setEmoji("❓")
                  .setLabel("誰投票了？")
                  .setStyle("PRIMARY")
                  .setCustomId("who_voted")
              ),
            ],
          });
          await UpdateDownvotesDb(interaction.message.id, interaction.user);
          await RemoveUpvotesDb(interaction.message.id, interaction.user);
        }
        const voted = await AlreadyDownVoted(
          interaction.message.id,
          interaction.user.id
        );
        if (voted) return interaction.deferUpdate().catch(() => {});
        let upvotes = parseInt(
          interaction.message.embeds[0].fields[0].value
            .split(" 票")
            .join("")
            .split("`")
            .join("")
        );
        let downvotes = parseInt(
          interaction.message.embeds[0].fields[1].value
            .split(" 票")
            .join("")
            .split("`")
            .join("")
        );
        downvotes++;
        const embed = interaction.message.embeds[0];
        embed.fields[0].key = "👍 **__贊成__:**";
        embed.fields[0].value = `\`\`\`${upvotes} 票\`\`\``;
        embed.fields[1].key = "👎 **__反對__:**";
        embed.fields[1].value = `\`\`\`${downvotes} 票\`\`\``;

        interaction.message.edit({
          embeds: [embed],
          components: [
            new MessageActionRow().addComponents(
              new MessageButton()
                .setLabel(`${upvotes}`)
                .setEmoji("👍")
                .setCustomId("vote")
                .setStyle("SECONDARY"),
              new MessageButton()
                .setLabel(`${downvotes}`)
                .setEmoji("👎")
                .setCustomId("unvote")
                .setStyle("SECONDARY"),
              new MessageButton()
                .setEmoji("❓")
                .setLabel("誰投票了？")
                .setStyle("PRIMARY")
                .setCustomId("who_voted")
            ),
          ],
        });
        await UpdateDownvotesDb(interaction.message.id, interaction.user);
        interaction.deferUpdate().catch(() => {});
      }
      break;
    case "who_voted":
      {
        let upvotes = parseInt(
          interaction.message.embeds[0].fields[0].value
            .split(" 票")
            .join("")
            .split("`")
            .join("")
        );
        let downvotes = parseInt(
          interaction.message.embeds[0].fields[1].value
            .split(" 票")
            .join("")
            .split("`")
            .join("")
        );
        const db = await Sugesstion.findOne({
          MessageId: interaction.message.id,
        });
        const upvoters = await WhoVotedUp(interaction.message.id);
        const downvoters = await WhoVotedDown(interaction.message.id);
        interaction.reply({
          embeds: [
            new MessageEmbed()
              .setTitle("❓ **誰對這個建議做出了反應？** ❓")
              .addFields([
                {
                  name: `👍 贊成: ${upvotes}`,
                  value: `${upvoters}`,
                  inline: true,
                },
                {
                  name: `👎 反對: ${downvotes}`,
                  value: `${downvoters}`,
                  inline: true,
                },
              ])
              .setFooter({
                text: client.user.username,
                iconURL: client.user.displayAvatarURL(),
              })
              .setColor(client.config.color.blue),
          ],
          ephemeral: true,
        });
      }
      break;
  }
});

// 💾 DATABASES 💾

async function UpdateUpvotesDb(findkey, updatekey) {
  await Sugesstion.findOneAndUpdate(
    { MessageId: findkey },
    { $push: { Up: "<@!" + updatekey + ">" } }
  );
}
async function UpdateDownvotesDb(findkey, updatekey) {
  await Sugesstion.findOneAndUpdate(
    { MessageId: findkey },
    { $push: { Down: "<@!" + updatekey + ">" } }
  );
}
async function RemoveUpvotesDb(findkey, updatekey) {
  await Sugesstion.findOneAndUpdate(
    { MessageId: findkey },
    { $pull: { Up: "<@!" + updatekey + ">" } }
  );
}
async function RemoveDownvotesDb(findkey, updatekey) {
  await Sugesstion.findOneAndUpdate(
    { MessageId: findkey },
    { $pull: { Down: "<@!" + updatekey + ">" } }
  );
}
async function AlreadyUpVoted(key, userid) {
  const findkey = "<@!" + userid + ">";
  const db = await Sugesstion.findOne({ MessageId: key });
  if (db.Up.includes(findkey)) {
    return true;
  } else {
    return false;
  }
}
async function AlreadyDownVoted(key, userid) {
  const findkey = "<@!" + userid + ">";
  const db = await Sugesstion.findOne({ MessageId: key });
  if (db.Down.includes(findkey)) {
    return true;
  } else {
    return false;
  }
}
async function WhoVotedUp(key) {
  const db = await Sugesstion.findOne({ MessageId: key });
  if (!db.Up.length) {
    return "沒有人贊成";
  } else {
    return db.Up.join("\n");
  }
}
async function WhoVotedDown(key) {
  const db = await Sugesstion.findOne({ MessageId: key });
  if (!db.Down.length) {
    return "沒有人反對";
  } else {
    return db.Down.join("\n");
  }
}
