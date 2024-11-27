
module.exports.diceRollCommand = async (message) => {
    const DICE_CHANNEL_ID = '1153898243315482674';  // Substitua pela ID do canal  

    // Ignore se a mensagem for do bot  
    if (message.author.bot) return;

    // Excluir todas as mensagens que não são do bot  
    message.delete();

    const dicePattern = /^(\d+)d(\d+)$/;
    const helpPattern = /^help$/;

    if (message.content.match(helpPattern)) {
        const helpMessage = "🎲 **Ajuda para Rolagem de Dados**\n" +
            "Para rolar dados, use o formato `[quantidade]d[lados]`. Exemplo: `1d20`.\n" +
            "Você pode rolar múltiplos dados, como `3d6`.";
        sendTempMessage(message, helpMessage, 10000); // Envia a mensagem de ajuda e a deleta após 10 segundos  
        return;
    }

    const match = message.content.match(dicePattern);
    if (match) {
        const [_, diceCount, sides] = match;
        const rolls = [];
        let total = 0;
        for (let i = 0; i < parseInt(diceCount); i++) {
            const roll = Math.floor(Math.random() * parseInt(sides)) + 1;
            rolls.push(roll);
            total += roll;
        }
        const response = `🎲 **${message.author.username}** rolou ${diceCount}d${sides}: ${rolls.join(', ')} (Total: ${total})`;
        message.channel.send(response); // Esta mensagem permanece no canal  
    } else {
        sendTempMessage(message, "Comando inválido. Envie `help` para obter instruções.", 10000); // Envia mensagem de erro e a deleta após 10 segundos  
    }
};

function sendTempMessage(message, content, delay) {
    message.channel.send(content).then(sentMessage => {
        setTimeout(() => sentMessage.delete().catch(console.error), delay);
    }).catch(console.error);
}  