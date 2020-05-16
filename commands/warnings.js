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
  name: "warnings",
  description: "Check the warns of a user!",
  aliases: ["warns"],
  usage: "[@user || user id]",
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
        .setDescription(`Please specify a member to check the warns for!`);
      if (!args[0]) return message.channel.send(emb3);

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

      let emb2 = new Discord.RichEmbed()
        .setColor(config.color.red)
        .setDescription("Cannot check warnings of a bot!");

      let isBot = await bot.fetchUser(user);
      if (isBot.bot) return message.channel.send(emb2);

      let chk = await message.guild.fetchMember(user);

      let emb7 = new Discord.RichEmbed()
        .setColor(config.color.red)
        .setDescription(
          "That user has no warnings because they are too powerful! :)"
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
      let u = await message.guild.fetchMember(user);

      function compare(a, b) {
        return Number(a.position) - Number(b.position);
      }

      let list = CASE.warnings
        .sort(compare)
        .map(
          w => `${w.wid} | **${w.reason}** (By: <@${w.warnedBy}> at ${w.when})`
        );
      if (!list[0]) {
        list = "None.";
      }

      let emb5 = new Discord.RichEmbed()
        .setColor(config.color.blue)
        .setTitle(`Warnings for ${u.user.username}:`)
        .setAuthor(u.user.username, u.user.displayAvatarURL)
        .setDescription(list);

      message.channel.send(emb5);
    } else return;
  }
};
