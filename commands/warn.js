const Discord = require("discord.js");
const db = require("quick.db");

module.exports = {
  name: "warn",
  description: "Warn an user!",
  group: "admin",
  usage: "[@user | user id] [reason]",
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
        .setDescription(`Please specify a member to be warned!`);
      if (!args[0]) return message.channel.send(emb3);

      let emb4 = new Discord.RichEmbed()
        .setColor(config.color.red)
        .setDescription(`Please specify the reason of the warning!`);
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
        let temp = bot.f.getIDfromMention(args[0]);
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
        .setDescription("Cannot warn a bot!");

      let isBot = await bot.fetchUser(user);
      if (isBot.bot) return message.channel.send(emb2);

      let chk = await message.guild.fetchMember(user);

      let emb7 = new Discord.RichEmbed()
        .setColor(config.color.red)
        .setDescription(
          "You can't warn that user because they are too powerful! :)"
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
      let time = Date(Date.now()).slice(0, -38) + " GMT";
      let reason = args.slice(1).join(" ");
      let CASE = db.fetch(user);

      let currId = Number(CASE.warnings.length) + 1;

      CASE.warnings.push({
        wid: currId,
        reason: reason,
        warnedBy: message.author.id,
        when: time,
        where: message.channel.id
      });
      db.set(user, CASE);

      let emb5 = new Discord.RichEmbed()
        .setColor(config.color.blue)
        .setDescription(`<@${user}> was warned for: **${reason}**`);

      message.delete();

      let u = await bot.fetchUser(user);

      let emb6 = new Discord.RichEmbed()
        .setColor(config.color.blue)
        .setDescription(
          `You were warned in \`${message.guild.name}\` for: **${reason}**`
        );

      u.send(emb6).catch(e =>
        console.log("Probably cannot DM user, see info below.\n" + e.stack)
      );

      await message.channel.send(emb5);
      if(bot.f.chance(10)) {
        message.channel.send('**F**');
        // Easter eggs for the win baby :)
      }
    } else return;
  }
};
