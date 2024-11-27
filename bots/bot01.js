require('dotenv').config();
const { Client } = require('discord.js');
const { intents } = require('../config/botConfig');
const { adminRoleCommand } = require('../commands/adminRoleCommand');

const client = new Client({ intents });

//loga no console dos valores de process.env
console.log('process.env.BOT01_TOKEN:', process.env.BOT01_TOKEN);
console.log('process.env.CHANNEL_LOGS:', process.env.CHANNEL_LOGS);
console.log('process.env.ROLE_MONGA:', process.env.ROLE_MONGA);
console.log('process.env.ROLE_ADMIN:', process.env.ROLE_ADMIN);


client.on('ready', () => {
    console.log(`✅ Bot ${client.user.tag} está online!`);
});

client.on('messageCreate', async (message) => {
    // Loga detalhes básicos da mensagem no console  
    console.log(`Nova mensagem de ${message.author.tag} no canal ${message.channel.name}: ${message.content}`);
});

client.on('error', (error) => {
    console.error(`🚨 Erro no bot: ${error}`);
});

client.login(process.env.BOT01_TOKEN).catch(error => {
    console.error('❌ Erro ao conectar ao Discord:', error);
});

module.exports = client;
