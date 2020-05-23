const Discord = require("discord.js");

module.exports = {
  name: "say",
  description: "Make me say whatever you want!",
  group: 'dev',
  cooldown: 1,
  guildOnly: true,
  ownerOnly: true,
  execute: async (message, args, bot, config, command, aargs) => {
    message.delete();
    if(!aargs) return;
    message.channel.send(args.join(' '));
  }
};