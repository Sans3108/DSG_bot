const Discord = require("discord.js");

module.exports = {
  name: "roleinfo",
  description: "Check info about a role!",
  group: "info",
  usage: "[role name]",
  cooldown: 1,
  guildOnly: true,
  execute: async (message, args, bot, config) => {
    let inline = true

    let role = args.join(` `)
    if(!role) return message.reply("Specifies a role!");
    let gRole = message.guild.roles.find(`name`, role);
    if(!gRole) return message.reply("I didn't find the role");

    const status = {
        false: "No",
        true: "Yes"
      }

    let roleemebed = new Discord.RichEmbed()
    .setColor(config.color.blue)
    .addField("ID", gRole.id, inline )
    .addField("Name", gRole.name, inline)
    .addField("Mention", `\`<@${gRole.id}>\``, inline)
    .addField("Color", gRole.hexColor, inline)
    .addField("Members", gRole.members.size, inline)
    .addField("Position", gRole.position, inline)
    .addField("Hoisted", status[gRole.hoist], inline)
    .addField("Mentionable", status[gRole.mentionable], inline)
    .addField("Managed", status[gRole.managed], inline)
    .setTimestamp()
    .setFooter(`© ${bot.user.username}`, bot.user.avatarURL)

    message.channel.send(roleemebed);
  }
};
