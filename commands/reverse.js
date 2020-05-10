const Discord = require("discord.js");

module.exports = {
  name: "reverse",
  description: "Reverse any text!",
  group: 'fun',
  cooldown: 1,
  guildOnly: true,
  args: true,
  execute: async (message, args, bot, config) => {
    let emb1 = new Discord.RichEmbed()
        .setColor(config.color.green)
        .setDescription(args.join(' ').split('').reverse().join(''));
    message.reply(emb1);
  }
};