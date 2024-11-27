require('dotenv').config();

const timers = new Map();  // Armazena os timers para controle individual  

async function adminRoleCommand(message) {
    if (message.author.bot) return;

    const logChannel = message.guild.channels.cache.get(process.env.CHANNEL_LOGS);
    if (!logChannel) {
        console.log("Canal de logs não encontrado.");
        return;
    }

    logChannel.send(`Comando recebido de ${message.author.tag} no canal ${message.channel.name}: ${message.content}`);
    console.log(`Comando recebido: ${message.content}`);

    const parts = message.content.split(' ');
    const command = parts[0].toLowerCase();
    const subCommand = parts[1];

    if (command === '!admin') {
        if (!message.member.roles.cache.some(role => role.name === process.env.ROLE_MONGA)) {
            message.reply('Você não tem permissão para usar este comando!');
            return;
        }

        switch (subCommand) {
            case 'add':
                await addAdminRole(message, logChannel);
                return;
            case 'remove':
                await removeAdminRole(message, logChannel);
                return;
            case 'list':
                await listAdmins(message, logChannel);
                return;
            case 'help':
                await showHelp(message);
                return;
            default:
                message.reply('Comando não reconhecido. Use `!admin help` para ver a lista de comandos.');
                return;
        }
    }
}

async function addAdminRole(message, logChannel) {
    const adminRole = message.guild.roles.cache.find(role => role.name === process.env.ROLE_ADMIN);
    if (!adminRole) {
        logChannel.send('⚠️ Role admin não encontrada!');
        return message.reply('Role admin não encontrada!');
    }

    try {
        await message.member.roles.add(adminRole);
        message.reply(`Role ${process.env.ROLE_ADMIN} atribuída por 1 hora!`);
        logChannel.send(`${message.author.tag} teve a role ${process.env.ROLE_ADMIN} atribuída.`);

        clearTimeout(timers.get(message.author.id));
        const timer = setTimeout(async () => {
            if (message.member.roles.cache.has(adminRole.id)) {
                await message.member.roles.remove(adminRole);
                message.member.send(`Sua role ${process.env.ROLE_ADMIN} foi removida após 1 hora.`);
                logChannel.send(`${message.author.tag} teve a role ${process.env.ROLE_ADMIN} removida.`);
            }
        }, 3600000); // 1 hora em milissegundos  

        timers.set(message.author.id, timer);
    } catch (error) {
        logChannel.send(`Erro ao adicionar a role: ${error}`);
        message.reply('Ocorreu um erro ao atribuir a role.');
    }
}

async function removeAdminRole(message, logChannel) {
    const adminRole = message.guild.roles.cache.find(role => role.name === process.env.ROLE_ADMIN);
    if (!adminRole) {
        logChannel.send('⚠️ Role admin não encontrada!');
        return message.reply('Role admin não encontrada!');
    }

    try {
        clearTimeout(timers.get(message.author.id));
        await message.member.roles.remove(adminRole);
        message.reply(`Role ${process.env.ROLE_ADMIN} removida!`);
        logChannel.send(`${message.author.tag} teve a role ${process.env.ROLE_ADMIN} removida.`);
    } catch (error) {
        logChannel.send(`Erro ao remover a role: ${error}`);
        message.reply('Ocorreu um erro ao remover a role.');
    }
}

async function listAdmins(message, logChannel) {
    const adminRole = message.guild.roles.cache.find(role => role.name === process.env.ROLE_ADMIN);
    if (!adminRole) {
        logChannel.send('⚠️ Role admin não encontrada!');
        return message.reply('Role admin não encontrada!');
    }

    const admins = adminRole.members.map(member => member.user.tag).join(', ');
    message.reply(`Usuários com a role ${process.env.ROLE_ADMIN}: ${admins}`);
    logChannel.send(`Lista de usuários com a role ${process.env.ROLE_ADMIN}: ${admins}`);
}

async function showHelp(message) {
    const helpMessage = `  
      Comandos disponíveis:  
      - \`!admin add\` - atribui a role admin ao usuário por 1 hora  
      - \`!admin remove\` - remove a role admin do usuário  
      - \`!admin list\` - lista todos os usuários com a role admin  
      - \`!admin help\` - exibe esta mensagem de ajuda  
    `;
    message.reply(helpMessage);
}

module.exports = { adminRoleCommand };
