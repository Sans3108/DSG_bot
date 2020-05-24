const Discord = require("discord.js");
const moment = require("moment");

module.exports = {
  name: "userinfo",
  description: "Check out your or someone else's info!",
  group: 'info',
  cooldown: 2,
  guildOnly: true,
  execute: async (message, args, bot, config, command, aargs) => {
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
      
      let egg = new Discord.RichEmbed()
      .setColor(config.color.blue)
      .setThumbnail(user.avatarURL)
      .setTitle('** User Info **')
      .addField("Name", `I have no idea what's his name :v` + "\n")
      .addField("Tag", `6969 funni number xd` + "\n")
      .addField('ID', `agent 007` + "\n")
      .addField('Nickname', `that cool guy` + "\n")
      .addField('Created on', `uhh` + "\n")
      .addField('Entered on', `Idk... at least a few days ago maybe?` + "\n")
      .addField('Status', `vibing` + "\n")
      .addField('Game', `Probably fortnite or minecraft :/` + "\n")
      .addField('Roles', 'all of them :o' + "\n")
      .setTimestamp()
      .setFooter(`© ${bot.user.username}`, bot.user.avatarURL);
    
      if(bot.f.chance(2)) {
        message.channel.send(egg);
        // Easter eggs for the win baby :)
      } else {
        message.channel.send(embed);
      }
  }
};