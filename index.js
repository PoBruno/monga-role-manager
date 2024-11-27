require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const express = require('express');

// Configuração do servidor Express
const app = express();
const port = process.env.PORT || 3000;

// Rota padrão para testar a página Vercel
app.get('/', (req, res) => {
  res.send('<h1>Bot Mongaboss está rodando!</h1>');
});

// Inicia o servidor Express
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

// Evento de conexão do bot
client.on('ready', () => {
  console.log(`✅ Bot ${client.user.tag} está online!`);
});

// Evento de mensagens recebidas
client.on('messageCreate', async (message) => {
  // Ignora mensagens do próprio bot
  if (message.author.bot) return;

  // Log das mensagens recebidas
  console.log(`[Mensagem] ${message.author.tag}: ${message.content}`);

  // Verifica se a mensagem está no canal correto
  if (message.channel.id !== process.env.CHANNEL_ID) {
    console.log(`[Ignorado] Mensagem fora do canal permitido: ${message.channel.name}`);
    return;
  }

  // Verifica se o usuário tem a role #monga
  if (!message.member.roles.cache.some(role => role.name === process.env.MONGA_ROLE_NAME)) {
    console.log(`[Sem permissão] ${message.author.tag} tentou usar um comando sem a role #monga.`);
    return message.reply('Você não tem permissão para usar este comando!');
  }

  // Comando para atribuir a role #admin
  if (message.content === '!monga admin') {
    const adminRole = message.guild.roles.cache.find(role => role.name === process.env.ADMIN_ROLE_NAME);
    if (!adminRole) {
      console.error('⚠️ Role admin não encontrada!');
      return message.reply('Role admin não encontrada!');
    }

    try {
      await message.member.roles.add(adminRole);
      message.reply(`Role ${process.env.ADMIN_ROLE_NAME} atribuída por 24 horas!`);
      console.log(`✅ ${message.author.tag} recebeu a role #admin.`);

      // Remove a role após 24 horas
      setTimeout(async () => {
        await message.member.roles.remove(adminRole);
        message.member.send(`Sua role ${process.env.ADMIN_ROLE_NAME} foi removida após 24 horas.`);
        console.log(`🕒 ${message.author.tag} teve a role #admin removida.`);
      }, 24 * 60 * 60 * 1000); // 24 horas em milissegundos

    } catch (error) {
      console.error(`❌ Erro ao adicionar a role: ${error}`);
      message.reply('Ocorreu um erro ao atribuir a role.');
    }
  }
});

// Evento de erro
client.on('error', (error) => {
  console.error(`🚨 Erro no bot: ${error}`);
});

// Evento para tratar possíveis desconexões
client.on('shardDisconnect', (event, shardId) => {
  console.warn(`⚡ Shard ${shardId} desconectada. Razão: ${event.reason}`);
  console.log('Tentando reconectar...');
});

// Conecta o bot usando o token do Discord
client.login(process.env.TOKEN).then(() => {
  console.log('🔗 Conectado com sucesso ao Discord!');
}).catch(error => {
  console.error('❌ Erro ao conectar ao Discord:', error);
  setTimeout(() => client.login(process.env.TOKEN), 5000); // Tentativa de reconexão após 5 segundos
});
