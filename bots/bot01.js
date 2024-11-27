require('dotenv').config();
const { Client } = require('discord.js');
const { intents } = require('../config/botConfig');
const { adminRoleCommand } = require('../commands/adminRoleCommand');
const { diceRollCommand } = require('../commands/diceRollCommand');


const client = new Client({ intents });

//loga no console dos valores de process.env
console.log('process.env.BOT01_TOKEN:', process.env.BOT01_TOKEN);
console.log('process.env.CHANNEL_LOGS:', process.env.CHANNEL_LOGS);
console.log('process.env.ROLE_MONGA:', process.env.ROLE_MONGA);
console.log('process.env.ROLE_ADMIN:', process.env.ROLE_ADMIN);

client.on('ready', () => {
    console.log(`✅ Bot ${client.user.tag} está online!`);
});

// Registra o evento de mensagem
client.on('messageCreate', async message => {

    // Função !admin
    if (message.content.startsWith('!admin')) {
        await adminRoleCommand(message);
    } else {
        console.log("Recebido comando não reconhecido: ", message.content);
    }

    // Função !roll
    diceRollCommand(message);
}); 


client.on('error', (error) => {
    console.error(`🚨 Erro no bot: ${error}`);
});

client.login(process.env.BOT01_TOKEN).catch(error => {
    console.error('❌ Erro ao conectar ao Discord:', error);
});  

module.exports = client;
