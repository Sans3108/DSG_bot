const Discord = require("discord.js");
const db = require("quick.db");
const _ = require("lodash");

module.exports = {
  name: "warnlist",
  description: "Lists all the existing warnings for everyone!",
  group: "admin",
  cooldown: 300,
  aliases: ["listwarns"],
  guildOnly: true,
  execute: async (message, args, bot, config, command, aargs) => {
    if (
      message.member.roles.find(r => r.id === "705840944314056794") ||
      message.member.roles.find(r => r.id === "705840476544041060")
    ) {
      await message.guild
        .fetchMembers()
        .then(() =>
          console.log("Fetched all members from " + message.guild.name)
        )
        .catch(e => {
          console.log(e.stack);
          message.channel.send(
            e.message +
              `\nPlease contact <@${config.ownerID}> or any staff and show them this error.`
          );
        });
      
      let icon = message.guild.iconURL.slice(0, -3) + 'gif';
      
      let emb1 = new Discord.RichEmbed()
        .setColor(config.color.blue)
        .setThumbnail(icon)
        .setTitle("Warn list for **" + message.guild.name + "**:")
        .setDescription('It will probably take a bit to fetch everything...\nI\'ll let you know when I\'m done!')
        
      message.channel.send(emb1);
      
      function compare(a, b) {
        return Number(a.wid) - Number(b.wid);
      }
      
      let all = db.all().filter(i => i.ID !== 'CONFIG').map(i => i.ID);
      let chunks = _.chunk(all, 25);
        
      await chunks.forEach(async i => {
        let emb = new Discord.RichEmbed()
          .setColor(config.color.blue);
        
        await i.forEach(item => {
          let CASE = db.fetch(item);
        
          let USER = message.guild.members.get(item);

          let list = CASE.warnings.sort(compare).map(w =>`\`Case ${w.wid}:\` **${w.reason}**\n(By: <@${w.warnedBy}> in <#${w.where}> at ${w.when})`);
        
          if (USER && list[0]) {        
            emb.addField(`Tag: ***${USER.user.tag}***   ID: ***${item}***`, list);
          }
        })
        
        await message.channel.send(emb);
      });
      
      let emb2 = new Discord.RichEmbed()
        .setColor(config.color.green)
        .setDescription('Done fetching all the warnings.');
      
      await message.channel.send(emb2);
      if(bot.f.chance(5)) {
        message.channel.send('Damn that\'s a lotta warns :v');
        // Easter eggs for the win baby :)
      }
    } else return;
  }
};
