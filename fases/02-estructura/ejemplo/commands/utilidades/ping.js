module.exports = {
    name: 'ping',
    description: 'responde con la latencia del bot',

    async execute(message, args, client) {
        // tiempo que tardo el mensaje en llegar
        const latencia = Date.now() - message.createdTimestamp;

        await message.reply(`🏓 pong! (${latencia} ms) | api: ${client.ws.ping} ms`);
    },
};