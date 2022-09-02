const client = require('../');
const customSuggestionSchema = require('../schema/suggestionSettings')
const starboardSchema = require('../schema/starboard')
const suggestionSchema = require('../schema/suggest')

client.on("guildDelete", async(guild) => {
    customSuggestionSchema.findOne({ GuildID: guild.id }, async (err, data) => {
        if (data) data.delete();
    })
    starboardSchema.findOne({ GuildID: guild.id }, async (err, data) => {
        if (data) data.delete();
    })
    suggestionSchema.findOne({ GuildID: guild.id }, async (err, data) => {
        if (data) data.delete();
    })
})