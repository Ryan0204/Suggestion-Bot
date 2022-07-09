const client = require("..");

client.on("messageCreate", async(message) => {
    if (message.author.bot) return;
    if (!message.guild) return;
    if (!message.content.toLocaleLowerCase().startsWith(client.config.prefix)) return;
    const [cmd, ...args] = message.content
        .slice(client.config.prefix.length)
        .trim()
        .split(/ +/g);

    const command = client.commands.get(cmd.toLowerCase()) || client.commands.find(c => c.aliases?.includes(cmd.toLowerCase()));

    if (!command) return;
    await command.run(client, message, args);
})