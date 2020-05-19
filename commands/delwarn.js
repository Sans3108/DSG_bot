const Discord = require("discord.js");
const db = require("quick.db");

let f = {
  getIDfromMention: function(a) {
    if (typeof a !== typeof "string")
      return new Error("Param 1 is not a string!");

    if (a.startsWith("<@") && a.endsWith(">")) {
      let id = a.slice(2, -1);
      if (id.startsWith("!")) {
        id = id.slice(1);
      }
      return id;
    } else return new Error("Doesn't start with <@ and end with >");
  }
};
module.exports = {
  name: "delwarn",
  description: "Remove warnings from an user!",
  aliases: ["clearwarn", "removewarn"],
  usage: "[@user | user id] [warn id | all]",
  group: "admin",
  cooldown: 1,
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

      let emb3 = new Discord.RichEmbed()
        .setColor(config.color.red)
        .setDescription(`Please specify a member to delete warnings from!`);
      if (!args[0]) return message.channel.send(emb3);

      let emb4 = new Discord.RichEmbed()
        .setColor(config.color.red)
        .setDescription(
          `Please specify which warn you want to delete!\n(Check the number before the warning)`
        );
      if (!args[1]) return message.channel.send(emb4);

      let idORmention = false;
      if (message.guild.member(args[0])) {
        idORmention = true;
      }

      let user;
      let ret = false;
      if (idORmention) {
        user = args[0];
      } else {
        let temp = f.getIDfromMention(args[0]);
        if (message.guild.member(temp)) {
          user = temp;
        } else {
          ret = true;
        }
      }

      let emb1 = new Discord.RichEmbed()
        .setColor(config.color.red)
        .setDescription("Invalid user!");

      if (ret) return message.channel.send(emb1);
      
      let emb5 = new Discord.RichEmbed()
        .setColor(config.color.red)
        .setDescription(`That is not a valid warn id! \`${args[1]}\``);
      
      let v;
      if (parseInt(args[1]) > 0 || args[1].toLowerCase() === 'all') {
        v = false;
      } else {
        v = true;
      }
      if (v) return message.channel.send(emb5);

      let emb2 = new Discord.RichEmbed()
        .setColor(config.color.red)
        .setDescription("Cannot delete a warning from a bot!");

      let isBot = await bot.fetchUser(user);
      if (isBot.bot) return message.channel.send(emb2);

      let chk = await message.guild.fetchMember(user);

      let emb7 = new Discord.RichEmbed()
        .setColor(config.color.red)
        .setDescription(
          "That user has no warnings for you to delete because they are too powerful! :)"
        );

      if (
        chk.roles.find(r => r.id === "705840944314056794") ||
        chk.roles.find(r => r.id === "705840476544041060")
      )
        return message.channel.send(emb7);

      //--------------
      if (db.fetch(user) === null) {
        db.set(user, {
          warnings: []
        });
      }

      let CASE = db.fetch(user);
      
      if(args[1].toLowerCase() === 'all') {
        db.delete(user);
        
        let emb10 = new Discord.RichEmbed()
          .setColor(config.color.green)
          .setDescription(`Deleted \`all\` warnings from <@${user}>.`);
      
        return message.channel.send(emb10);
      }

      let warning = CASE.warnings.find(i => parseInt(i.wid) === parseInt(args[1]));
      let emb9 = new Discord.RichEmbed()
        .setColor(config.color.red)
        .setDescription(`Cannot find a matching case id. \`${parseInt(args[1])}\``);
      if(!warning) return message.channel.send(emb9);

      let index = CASE.warnings.indexOf(warning);
      
      CASE.warnings.splice(index, 1);

      db.set(user, CASE);
      
      let emb8 = new Discord.RichEmbed()
        .setColor(config.color.green)
        .setDescription(`Deleted warning (\`${parseInt(args[1])}\`) from <@${user}>.`);
      
      message.channel.send(emb8);
      
    } else return;
  }
};
