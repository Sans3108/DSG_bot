const Discord = require("discord.js");
const db = require("quick.db");
const _ = require("lodash");

module.exports = {
  name: "warnlist",
  description: "Lists all the existing warnings for everyone!",
  group: "admin",
  cooldown: 180,
  aliases: ["listwarns"],
  guildOnly: true,
  execute: async (message, args, bot, config, command, aargs) => {
    if (
      message.member.roles.find(r => r.id === "705840944314056794") ||
      message.member.roles.find(r => r.id === "705840476544041060")
    ) {
      await message.guild
        .fetchMembers()
        .then(() => console.log("Fetched all members from " + message.guild.name))
        .catch(e => {
          console.log(e.stack);
          message.channel.send(
            e.message +
              `\nPlease contact <@${config.ownerID}> or any staff and show them this error.`
          );
        });
    
      let icon = message.guild.iconURL.slice(0, -3) + 'gif';

      let all = db.all().filter(i => i.ID !== "CONFIG").map(i => i.ID);
    
      let filtered = [];
    
      await all.forEach(item => {
        let member = message.guild.members.get(item);
      
        if(member) {
          filtered.push(item);
        }
      });
    
      let chunks = _.chunk(filtered, 5);
      let pages = [];
      let totalPages = chunks.length;
      let count = 0;
    
      await chunks.forEach(async chunk => {
        let emb = new Discord.RichEmbed()
          .setColor(config.color.blue)
          .setThumbnail(icon)
          .setTitle("Warn list for **" + message.guild.name + "**:");
      
        await chunk.forEach(item => {
          let CASE = db.fetch(item);
          let USER = message.guild.members.get(item);
        
          function compare(a, b) {
            return Number(a.wid) - Number(b.wid);
          }
        
          let list = CASE.warnings.sort(compare).map(w =>`\`Case ${w.wid}:\` **${w.reason}**\n(By: <@${w.warnedBy}> in <#${w.where}> at ${w.when})`);
        
          if (USER && list[0]) {        
            emb.addField(`Tag: ***${USER.user.tag}***   ID: ***${item}***`, list);
          }
        });
        count = count + 1;
        emb.setFooter(`Page: ${count}/${totalPages}`);
        pages.push({ count: count, emb: emb});
      });

      let emb1 = new Discord.RichEmbed()
        .setColor(config.color.blue)
        .setThumbnail(icon)
        .setTitle("Warn list for **" + message.guild.name + "**:")
        .setDescription('Loading...')
        .setFooter(`Page: ?/?`);
    
      let msg = await message.channel.send(emb1);
    
      let currentPage = 1;
    
      await msg.edit('', { embed: pages[0].emb });
      
      if (bot.f.chance(5)) {
        message.channel.send("Damn that's a lotta warns :v");
        // Easter eggs for the win baby :)
      }
    
      await msg.react('⬅');
      await msg.react('⏹');
      await msg.react('➡');
    
      const filter = (reaction, user) => {
	      return reaction.emoji.name === '⬅' || reaction.emoji.name === '⏹' || reaction.emoji.name === '➡' && user.id !== bot.user.id && !user.bot;
      };
    
      const collector = msg.createReactionCollector(filter, { time: 120000 });

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
      
    } else return;
  }
};
