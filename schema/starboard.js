const mongoose = require("mongoose");
const StarBoard = new mongoose.Schema({
    GuildID: String,
    Enabled: Boolean,
    Emoji: String,
    Count: String,
    ChannelID: String,
});

module.exports = mongoose.model("starboard", StarBoard);
