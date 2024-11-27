//
require('dotenv').config();
const { Client, GatewayIntentBits, PermissionsBitField } = require('discord.js');

const express = require('express');
const app = express();
const port = 3000;  // A porta correta para o Replit

// Teste simples de resposta
app.get('/', (req, res) => {
  res.send('Bot Mongaboss está online!');
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});


const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent
  ],
});

client.on('ready', () => {
  console.log(`Bot ${client.user.tag} está online!`);
});

client.on('messageCreate', async (message) => {
  if (message.channel.id !== process.env.CHANNEL_ID) return;  // Restringe o canal
  if (!message.member.roles.cache.some(role => role.name === process.env.MONGA_ROLE_NAME)) return;

  if (message.content === '!monga admin') {
    const adminRole = message.guild.roles.cache.find(role => role.name === process.env.ADMIN_ROLE_NAME);
    if (!adminRole) return message.reply('Role admin não encontrada!');

    try {
      await message.member.roles.add(adminRole);
      message.reply(`Role ${process.env.ADMIN_ROLE_NAME} atribuída por 24 horas!`);

      // Remove a role após 24 horas
      setTimeout(async () => {
        await message.member.roles.remove(adminRole);
        message.member.send(`Sua role ${process.env.ADMIN_ROLE_NAME} foi removida após 24 horas.`);
      }, 24 * 60 * 60 * 1000); // 24 horas em milissegundos

    } catch (error) {
      console.error('Erro ao adicionar a role:', error);
      message.reply('Ocorreu um erro ao atribuir a role.');
    }
  }
});

client.login(process.env.TOKEN);


