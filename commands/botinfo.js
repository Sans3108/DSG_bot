const Discord = require("discord.js");
const moment = require("moment");

module.exports = {
  name: "botinfo",
  description: "Check bot info!",
  group: "info",
  cooldown: 1,
  guildOnly: true,
  execute: async (message, args, bot, config, command, aargs) => {
    let totalSeconds = bot.uptime / 1000;
    let days = Math.floor(totalSeconds / 86400);
    totalSeconds %= 86400;
    let hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = Math.floor(totalSeconds % 60);

    let embed = new Discord.RichEmbed()
      .setColor(config.color.blue)
      .setThumbnail(bot.user.avatarURL)
      .setTitle("** Bot Info **")
      .addField("Name", `${bot.user.username}` + "\n")
      .addField("Tag", `#${bot.user.discriminator}`)
      .addField("ID", `${bot.user.id}` + "\n")
      .addField(
        "Developers",
        `<@366536353418182657> & <@350690201267339269>` + "\n"
      )
      .addField(
        "Uptime",
        `\`${days} day(s)\`, \`${hours} hour(s)\`, \`${minutes} minute(s)\`, \`${seconds} second(s)\`` +
          "\n"
      )
      .setTimestamp()
      .setFooter(`© ${bot.user.username}`, bot.user.avatarURL);
    message.channel.send(embed);
  }
};
