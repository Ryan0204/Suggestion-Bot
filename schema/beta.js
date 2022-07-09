const mongoose = require("mongoose");
const Data = new mongoose.Schema({
  GuildID: String,
  Beta: Boolean
});

module.exports = mongoose.model("infos", Data);
