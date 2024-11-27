require('dotenv').config();

module.exports.adminRoleCommand = async (message) => {
    if (message.author.bot) return;

    // Enviar logs para o canal de logs  
    const logChannel = message.guild.channels.cache.get(process.env.CHANNEL_LOGS);
    if (!logChannel) {
        console.log("Canal de logs não encontrado.");
        return;
    }

    // Logar a mensagem no canal de logs e no console  
    logChannel.send(`Comando recebido de ${message.author.tag} no canal ${message.channel.name}: ${message.content}`);
    console.log(`Comando recebido: ${message.content}`);

    // Processar comandos  
    const parts = message.content.split(' ');
    const command = parts[0];
    const action = parts[1];
    const subCommand = parts[2];

    if (command === '!monga' && action === 'admin') {
        if (!message.member.roles.cache.some(role => role.name === process.env.ROLE_MONGA)) {
            return message.reply('Você não tem permissão para usar este comando!');
        }

        switch (subCommand) {
            case 'add':
                await addAdminRole(message, logChannel);
                break;
            case 'remove':
                await removeAdminRole(message, logChannel);
                break;
            case 'list':
                await listAdmins(message, logChannel);
                break;
            case 'help':
                await showHelp(message);
                break;
            default:
                message.reply('Comando não reconhecido. Use `!monga admin help` para ver a lista de comandos.');
        }
    }
};

async function addAdminRole(message, logChannel) {
    const adminRole = message.guild.roles.cache.find(role => role.name === process.env.ROLE_ADMIN);
    if (!adminRole) {
        logChannel.send('⚠️ Role admin não encontrada!');
        return message.reply('Role admin não encontrada!');
    }

    try {
        await message.member.roles.add(adminRole);
        message.reply(`Role ${process.env.ROLE_ADMIN} atribuída por 24 horas!`);
        logChannel.send(`${message.author.tag} teve a role ${process.env.ROLE_ADMIN} atribuída.`);

        // Remove a role após 24 horas  
        setTimeout(async () => {
            await message.member.roles.remove(adminRole);
            message.member.send(`Sua role ${process.env.ROLE_ADMIN} foi removida após 24 horas.`);
            logChannel.send(`${message.author.tag} teve a role ${process.env.ROLE_ADMIN} removida.`);
        }, 24 * 60 * 60 * 1000); // 24 horas em milissegundos  
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
- \`!monga admin add\` - atribui a role admin ao usuário por 24 horas  
- \`!monga admin remove\` - remove a role admin do usuário  
- \`!monga admin list\` - lista todos os usuários com a role admin  
- \`!monga admin help\` - exibe esta mensagem de ajuda  
    `;
    message.reply(helpMessage);
}
