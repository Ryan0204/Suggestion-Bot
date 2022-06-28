const mongoose = require("mongoose");
const suggesmessage = new mongoose.Schema({
  guild: String,
  message: String,
  embedcolor_none: String,
  embedcolor_good: String,
  embedcolor_not: String,
  embedcolor_idk: String
});

module.exports = mongoose.model("suggesmessage", suggesmessage);
