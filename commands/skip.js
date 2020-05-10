const Discord = require("discord.js");

module.exports = {
  name: "skip",
  description: "Skip the current song!",
  group: 'music',
  aliases: ['s'],
  cooldown: 1,
  guildOnly: true,
  execute: async (message, args, bot, config) => {
    let queue = bot.queue.get(message.guild.id);
    
    let emb1 = new Discord.RichEmbed()
        .setColor(config.color.red)
        .setDescription('Please join a voice channel to run this command! ' + message.author);
    
    let emb2 = new Discord.RichEmbed()
        .setColor(config.color.red)
        .setDescription('⚠ No music is being played!');
    
    if (!message.member.voiceChannel) return message.channel.send(emb1);
    if (!queue) return message.channel.send(emb2);

    if (message.member.hasPermission('ADMINISTRATOR') || message.member.roles.find(r => r.name.toLowerCase() === "dj")) {
      queue.connection.dispatcher.end();
      
      let emb3 = new Discord.RichEmbed()
        .setColor(config.color.green)
        .setDescription(`🎵 Song skipped.`);
      return message.channel.send(emb3);
    } else {
      let emb4 = new Discord.RichEmbed()
        .setColor(config.color.red)
        .setDescription(`You need the DJ role or the \`ADMINISTRATOR\` permission to use this command! ${message.author}`);
      return message.channel.send(emb4);
    }
  }
};