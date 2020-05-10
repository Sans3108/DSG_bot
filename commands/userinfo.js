const Discord = require("discord.js");
const moment = require("moment");

module.exports = {
  name: "userinfo",
  description: "Check out your or someone else's info!",
  group: 'info',
  cooldown: 2,
  guildOnly: true,
  execute: async (message, args, bot, config) => {
    let user = message.mentions.users.first() || message.author
    const member = message.guild.member(user);
    let roles = member.roles.map(roles => `<@&${roles.id}>`).slice(1).join(', ') || 'None'
    
    let embed = new Discord.RichEmbed()
      .setColor(config.color.blue)
      .setThumbnail(user.avatarURL)
      .setTitle('** User Info **')
      .addField("Name", `${user.username}` + "\n")
      .addField("Tag", `${user.discriminator}` + "\n")
      .addField('ID', `${user.id}` + "\n")
      .addField('Nickname', `${member.nickname !== null ? `${member.nickname}` : 'None'}` + "\n")
      .addField('Created on', `${moment.utc(user.createdAt).format('dddd, MMMM Do YYYY, HH:mm:ss')}` + "\n")
      .addField('Entered on', `${moment.utc(member.joinedAt).format('dddd, MMMM Do YYYY, HH:mm:ss')}` + "\n")
      .addField('Status', `${user.presence.status}` + "\n")
      .addField('Game', `${user.presence.game ? user.presence.game.name : 'None'}` + "\n")
      .addField('Roles', roles + "\n")
      .setTimestamp()
      .setFooter(`© ${bot.user.username}`, bot.user.avatarURL);
    
      message.channel.send(embed);
  }
};