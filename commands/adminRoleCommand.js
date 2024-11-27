require('dotenv').config();

module.exports.adminRoleCommand = async (message) => {
    if (message.author.bot) return;
    if (message.channel.id !== process.env.CHANNEL_LOGS) return;
    if (!message.member.roles.cache.some(role => role.name === process.env.ROLE_MONGA)) {
        return message.reply('Você não tem permissão para usar este comando!');
    }

    // `!monga admin` atribui a role de admin por {24} horas
    if (message.content === '!monga admin') {
        const adminRole = message.guild.roles.cache.find(role => role.name === process.env.ROLE_ADMIN);
        if (!adminRole) {
            return message.reply('Role admin não encontrada!');
        }
        try {
            await message.member.roles.add(adminRole);
            message.reply(`Role ${process.env.ROLE_ADMIN} atribuída por 24 horas!`);
            setTimeout(async () => {
                await message.member.roles.remove(adminRole);
                message.member.send(`Sua role ${process.env.ROLE_ADMIN} foi removida após 24 horas.`);
            }, 24 * 60 * 60 * 1000); // 24 horas em milissegundos  
        } catch (error) {
            message.reply('Ocorreu um erro ao atribuir a role.');
        }
    }

    // `!monga admin remove` remove a role de admin
    if (message.content === '!monga admin remove') {
        const adminRole = message.guild.roles.cache.find(role => role.name === process.env.ROLE_ADMIN);
        if (!adminRole) {
            return message.reply('Role admin não encontrada!');
        }
        try {
            await message.member.roles.remove(adminRole);
            message.reply(`Role ${process.env.ROLE_ADMIN} removida!`);
        } catch (error) {
            message.reply('Ocorreu um erro ao remover a role.');
        }
    }

    // `!monga admin list` lista os membros com a role de admin
    if (message.content === '!monga admin list') {
        const adminRole = message.guild.roles.cache.find(role => role.name === process.env.ROLE_ADMIN);
        if (!adminRole) {
            return message.reply('Role admin não encontrada!');
        }
        const membersWithRole = adminRole.members.map(member => member.user.tag);
        message.reply(`Membros com a role ${process.env.ROLE_ADMIN}: ${membersWithRole.join(', ')}`);
    }

    // `!monga admin help` exibe a ajuda
    if (message.content === '!monga admin help') {
        message.reply('Comandos disponíveis:\n\n!monga admin - atribui a role de admin por 24 horas\n!monga admin remove - remove a role de admin\n!monga admin list - lista os membros com a role de admin\n!monga admin help - exibe a ajuda');
    }

};  