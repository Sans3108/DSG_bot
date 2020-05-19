const Discord = require("discord.js");
const db = require("quick.db");

module.exports = {
  name: "warnlist",
  description: "Lists all the existing warnings for everyone!",
  group: "admin",
  cooldown: 120,
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
        .setDescription('It will take a bit to fetch and display all the warnings :/\nBlame Discord\'s API limitations for this...')
        
      message.channel.send(emb1);
      
      function compare(a, b) {
        return Number(a.wid) - Number(b.wid);
      }
      
      await db.all().map(i => i.ID).forEach(item => {
        let CASE = db.fetch(item);
        
        let USER = message.guild.members.get(item);
        
        if(!USER) {
          db.delete(item);
        }

        let list = CASE.warnings.sort(compare).map(w =>`\`Case ${w.wid}:\` **${w.reason}**\n(By: <@${w.warnedBy}> in <#${w.where}> at ${w.when})`);
        
        if (USER && list[0]) {
          
          let emb = new Discord.RichEmbed()
            .setColor(config.color.blue)
            .setAuthor(USER.user.tag, USER.user.displayAvatarURL)
            .setFooter(`ID: ${item}`)
            .setDescription(list);
        
          message.channel.send(emb);
        }
      });
      
      let emb2 = new Discord.RichEmbed()
        .setColor(config.color.green)
        .setDescription('Done fetching all the warnings.');
      
      message.channel.send(emb2);
    } else return;
  }
};
