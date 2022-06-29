const mongoose = require("mongoose");
const Poll = new mongoose.Schema({
    MessageID: String,
    OwnerID: String,
    Title: String,
    Options: Array,
    Option1: Array,
    Option2: Array,
    Option3: Array,
    Option4: Array,
    Option5: Array,
    Option6: Array,
    Option7: Array,
    Option8: Array,
    Option9: Array,
    Option10: Array,
    Public: Boolean,
    Ended: Boolean,
});

module.exports = mongoose.model("poll", Poll);
