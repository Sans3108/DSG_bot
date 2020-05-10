const Discord = require("discord.js");

module.exports = {
  name: "icon",
  description: "Check the server icon!",
  group: "general",
  cooldown: 1,
  guildOnly: true,
  execute: async (message, args, bot, config) => {
    let iconembed = new Discord.RichEmbed()
      .setColor("00ff00")
      .setImage(message.guild.iconURL)
      .setTitle("Icon")
      .setDescription("[Icon URL link](" + message.guild.iconURL + ")")
      .setTimestamp()
      .setFooter(`© ${bot.user.username}`, bot.user.avatarURL);
    message.channel.send(iconembed);
  }
};
