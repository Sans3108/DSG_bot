const Discord = require("discord.js");
const db = require('quick.db');

module.exports = {
  name: "vote-skip",
  description: "Vote to skip the current song!",
  group: 'music',
  aliases: ['vs'],
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
    
    let emb2 = new Discord.RichEmbed()
      .setColor(config.color.red)
      .setDescription(
        `Please join the same channel as me to use this command! ${message.author}`
    );

    if (!VC) return message.channel.send(emb1);
    
    if (message.guild.me.voiceChannel && VC.id !== message.guild.me.voiceChannel.id) return message.channel.send(emb2);
    
    let emb3 = new Discord.RichEmbed()
        .setColor(config.color.red)
        .setDescription('⚠ No music is being played!');
    
    if (!queue) return message.channel.send(emb3);
      
    let count = message.guild.me.voiceChannel.members.size - 1;
    
    let reqSkips;
    if(count < 8) {
      reqSkips = Math.ceil(count / 2);
    } else {
      reqSkips = Math.ceil(count / 3);
    }
    
    let emb6 = new Discord.RichEmbed()
      .setColor(config.color.red)
      .setDescription('You already voted to skip this song!')
    
    let cfg = db.fetch('CONFIG');
    
    if(bot.f.arrayContains(message.author.id, cfg.skippers)) return message.reply(emb6);
    
    cfg.skipVotes = cfg.skipVotes + 1;
    cfg.skippers.push(message.author.id);
    db.set('CONFIG', cfg);
    
    let v = db.fetch('CONFIG');
    let votes = v.skipVotes;
    
    if(votes >= reqSkips) {
      let emb4 = new Discord.RichEmbed()
        .setColor(config.color.green)
        .setDescription(`${votes}/${reqSkips} votes reached.\n🎵 Skipping...`);
      
      let c = db.fetch('CONFIG');
      c.skipVotes = 0;
      c.skippers = [];
      db.set('CONFIG', c);
      
      queue.connection.dispatcher.end();
    
      message.channel.send(emb4);
    } else {
      let emb5 = new Discord.RichEmbed()
        .setColor(config.color.blue)
        .setDescription(`Skipping? ${votes}/${reqSkips}`);
      
      message.channel.send(emb5);
    }
  }
};
