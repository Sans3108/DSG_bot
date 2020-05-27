const Discord = require("discord.js");
const _ = require("lodash");

module.exports = {
  name: "queue",
  description: "Check the current queue!",
  group: 'music',
  aliases: ['q'],
  cooldown: 2,
  guildOnly: true,
  execute: async (message, args, bot, config, command, aargs) => {
    let queue = bot.queue.get(message.guild.id);
    
    let emb1 = new Discord.RichEmbed()
        .setColor(config.color.red)
        .setDescription('⚠ No music is being played!');
    if (!queue) return message.channel.send(emb1)
    
      let icon = message.guild.iconURL.slice(0, -3) + 'gif';

      let all = queue.musics.map(music => [music.title, music.url, music.reqBy]).slice(1);
    
      if(!all[0]) {
        let specialEmb = new Discord.RichEmbed()
          .setColor(config.color.blue)
          .setThumbnail(icon)
          .setTitle("**Queue for " + message.guild.name + ":**")
          .setDescription(`🎵 __**Currently listening to:**__\n` + `[${queue.musics[0].title}](${queue.musics[0].url})\n`);
        
        return message.channel.send(specialEmb);
      }
    
      let chunks = _.chunk(all, 10);
      let pages = [];
      let totalPages = chunks.length;
      let count = 0;
      let songCount = 0;
    
      await chunks.forEach(async chunk => {
        let emb = new Discord.RichEmbed()
          .setColor(config.color.blue)
          .setThumbnail(icon)
          .setTitle("**Queue for " + message.guild.name + ":**")
          .setDescription(`🎵 __**Currently listening to:**__\n` + `[${queue.musics[0].title}](${queue.musics[0].url})\n`);
      
        await chunk.forEach(item => {
          songCount = songCount + 1;
          emb.addField(`**${songCount}.** (By: ${item[2]})`, `[${item[0]}](${item[1]})`);
        });
        
        count = count + 1;
        emb.setFooter(`Page: ${count}/${totalPages}`);
        pages.push({ count: count, emb: emb});
      });

      let emb2 = new Discord.RichEmbed()
        .setColor(config.color.blue)
        .setThumbnail(icon)
        .setTitle("**Queue for " + message.guild.name + ":**")
        .setDescription('Loading...')
        .setFooter(`Page: ?/?`);
    
      let msg = await message.channel.send(emb2);
    
      let currentPage = 1;
    
      await msg.edit('', { embed: pages[0].emb });
    
      await msg.react('⬅');
      await msg.react('⏹');
      await msg.react('➡');
    
      const filter = (reaction, user) => {
	      return reaction.emoji.name === '⬅' || reaction.emoji.name === '⏹' || reaction.emoji.name === '➡' && user.id !== bot.user.id && !user.bot;
      };
    
      const collector = msg.createReactionCollector(filter, { time: 60000 });

      collector.on('collect', reaction => {
	    if(reaction.emoji.name === '⏹') {
        collector.stop();
      } else if(reaction.emoji.name === '➡') {
        if(currentPage < totalPages) {
          currentPage = currentPage + 1;
          
          let page = pages.find(page => page.count === currentPage);
      
          msg.edit('', { embed: page.emb });
        }
      } else if(reaction.emoji.name === '⬅') {
        if(currentPage > 1) {
          currentPage = currentPage - 1;
        
          let page = pages.find(page => page.count === currentPage);
      
          msg.edit('', { embed: page.emb });
        }
      }
    });

    collector.on('end', collected => {
	    msg.clearReactions();
    });
  }
};
