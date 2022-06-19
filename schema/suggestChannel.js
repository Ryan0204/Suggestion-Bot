const mongoose = require("mongoose");
const schm = new mongoose.Schema({
  GuildID: String,
  ChannelID: String,
});

module.exports = mongoose.model("channel", schm);
