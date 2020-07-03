const Discord = require("discord.js");
const db = require('quick.db');

module.exports = {
  name: "skip",
  description: "Skip the current song!",
  group: 'music',
  aliases: ['s'],
  cooldown: 1,
  guildOnly: true,
  disabled: true,
  execute: async (message, args, bot, config, command, aargs) => {
    let queue = bot.queue.get(message.guild.id);
    
    let VC = message.member.voiceChannel;

    let emb1 = new Discord.RichEmbed()
      .setColor(config.color.red)
      .setDescription(
        `Please join a channel to use this command! ${message.author}`
    );
    
    let emb5 = new Discord.RichEmbed()
      .setColor(config.color.red)
      .setDescription(
        `Please join the same channel as me to use this command! ${message.author}`
    );

    if (!VC) return message.channel.send(emb1);
    
    if (message.guild.me.voiceChannel && VC.id !== message.guild.me.voiceChannel.id) return message.channel.send(emb5);
    
    let emb2 = new Discord.RichEmbed()
        .setColor(config.color.red)
        .setDescription('⚠ No music is being played!');
    
    if (!queue) return message.channel.send(emb2);

    if (message.member.hasPermission('ADMINISTRATOR') || message.member.roles.find(r => r.name.toLowerCase() === "dj")) {
      queue.connection.dispatcher.end();
        
      let c = db.fetch('CONFIG');
      c.skipVotes = 0;
      c.skippers = [];
      db.set('CONFIG', c);
      
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
