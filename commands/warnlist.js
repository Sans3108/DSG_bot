const Discord = require("discord.js");
const db = require("quick.db");

module.exports = {
  name: "warnlist",
  description: "Lists all the existing warnings for everyone!",
  group: "admin",
  cooldown: 1,
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
        .setTitle("Warn list for **" + message.guild.name + "**:");

      function compare(a, b) {
            return Number(a.wid) - Number(b.wid);
          }
      
      let ALL = db.all().map(i => i.ID).forEach(item => {
        let CASE = db.fetch(item);
        let USER = message.guild.members.get(item);

        let list = CASE.warnings.sort(compare).map(w =>`\`Case ${w.wid}:\` **${w.reason}**\n(By: <@${w.warnedBy}> in <#${w.where}> at ${w.when})`);
        
        if (list[0]) {
         emb1.addField(`Tag: **${USER.user.tag}** ID: **${USER.user.id}**`, list); 
        }
        
      });

      message.channel
        .send(emb1)
        .catch(e =>
          message.channel.send(
            "Most likely the message is too long, please contact Sans and show this to him."
          )
        );
    } else return;
  }
};
