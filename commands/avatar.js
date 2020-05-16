const Discord = require("discord.js");

module.exports = {
  name: "avatar",
  description: "Check out yours or someone elses avatar!",
  group: "general",
  usage: '<@mention>',
  cooldown: 1,
  guildOnly: true,
  execute: async (message, args, bot, config, command, aargs) => {
    let mentionedUser = message.mentions.users.first() || message.author;
    let embed = new Discord.RichEmbed()
      .setImage(mentionedUser.displayAvatarURL)
      .setColor(config.color.green)
      .setTitle("Avatar")
      .setFooter("Request by " + message.author.tag, message.author.avatarURL)
      .setDescription(
        "[Avatar URL link](" + mentionedUser.displayAvatarURL + ")"
      );
    message.channel.send(embed);
  }
};
