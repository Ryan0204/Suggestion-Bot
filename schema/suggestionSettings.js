const mongoose = require("mongoose");
const suggesmessage = new mongoose.Schema({
  GuildID: String,
  Mention: String,
  EmbedColorDefault: String,
  EmbedColorAccept: String,
  EmbedColorDecline: String,
  EmbedColorIdk: String,
  Thread: Boolean
});

module.exports = mongoose.model("config", suggesmessage);

