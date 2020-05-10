const Discord = require("discord.js");

const verifLevels = [
  "None",
  "Low",
  "Medium",
  "(╯°□°）╯︵  ┻━┻",
  "┻━┻ミヽ(ಠ益ಠ)ノ彡┻━┻"
];

module.exports = {
  name: "serverinfo",
  description: "Check out this server's info!",
  group: "info",
  cooldown: 1,
  guildOnly: true,
  execute: async (message, args, bot, config) => {
    let icon = message.guild.iconURL;
    let embed = new Discord.RichEmbed()
      .setTitle("**Server Info**")
      .setColor(config.color.green)
      .setThumbnail(icon)
      .addField("Server name", message.guild.name + "\n")
      .addField("Created at", message.guild.createdAt + "\n")
      .addField("You joined at", message.member.joinedAt + "\n")
      .addField("Members", message.guild.memberCount + "\n")
      .addField(
        "Owner",
        `${message.guild.owner.user.username}#${message.guild.owner.user.discriminator}`
      )
      .addField("Region", message.guild.region.charAt(0).toUpperCase() + message.guild.region.slice(1))
      .addField(
        "Total | Humans | Bots",
        `${message.guild.members.size} | ${
          message.guild.members.filter(member => !member.user.bot).size
        } | ${message.guild.members.filter(member => member.user.bot).size}`
      )
      .addField(
        "Verification Level",
        verifLevels[message.guild.verificationLevel]
      )
      .addField("Roles", message.guild.roles.size)
      .setTimestamp()
      .setFooter(`© ${bot.user.username}`, bot.user.avatarURL);
    message.channel.send(embed);
  }
};
