//
//

require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const express = require('express');

// Configuração do servidor Express para a webpage na Vercel
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('<h1>Bot Mongaboss está rodando!</h1>');
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});

// Configuração do bot do Discord
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
  // Ignora mensagens do bot
  if (message.author.bot) return;

  // Log das mensagens recebidas
  console.log(`[${message.author.tag}] ${message.content}`);

  // Verifica se a mensagem está no canal correto
  if (message.channel.id !== process.env.CHANNEL_ID) return;

  // Verifica se o usuário tem a role #monga
  if (message.member.roles.cache.some(role => role.name === process.env.MONGA_ROLE_NAME)) {
    console.log(`${message.author.tag} possui a role #monga.`);
  } else {
    console.log(`${message.author.tag} não possui a role #monga.`);
    return message.reply('Você não tem permissão para usar este comando!');
  }

  // Comando para atribuir a role #admin
  if (message.content === '!monga admin') {
    const adminRole = message.guild.roles.cache.find(role => role.name === process.env.ADMIN_ROLE_NAME);
    if (!adminRole) return message.reply('Role admin não encontrada!');

    try {
      await message.member.roles.add(adminRole);
      message.reply(`Role ${process.env.ADMIN_ROLE_NAME} atribuída por 24 horas!`);
      console.log(`${message.author.tag} recebeu a role #admin.`);

      // Remove a role após 24 horas
      setTimeout(async () => {
        await message.member.roles.remove(adminRole);
        message.member.send(`Sua role ${process.env.ADMIN_ROLE_NAME} foi removida após 24 horas.`);
        console.log(`${message.author.tag} teve a role #admin removida.`);
      }, 24 * 60 * 60 * 1000); // 24 horas em milissegundos

    } catch (error) {
      console.error('Erro ao adicionar a role:', error);
      message.reply('Ocorreu um erro ao atribuir a role.');
    }
  }
});

client.login(process.env.TOKEN);
