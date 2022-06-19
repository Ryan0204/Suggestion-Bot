const mongoose = require("mongoose");
const Sugesstion = new mongoose.Schema({
  MessageId: String,
  Up: Array,
  Down: Array,
});

module.exports = mongoose.model("suggest", Sugesstion);
