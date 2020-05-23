const Discord = require("discord.js");

let config = {
    prefix: 'd!'
}

module.exports = {
  name: "dev-help",
  description: "Lists all of my developer commands.",
  aliases: ["dev-commands", "dev-cmds"],
  usage: "[command name]",
  group: "dev",
  cooldown: 3,
  guildOnly: true,
  execute: async (message, args, bot, config, command, aargs) => {
    const data = [];
    const { commands } = message.client;
    const color = {
      green: "#18f23d",
      red: "#f21818",
      blue: "#18adf2",
      orange: "#f29018",
      random: "RANDOM"
    };

    //embeds
    const embed3 = new Discord.RichEmbed()
      .setColor(color.red)
      .setDescription("That command does not exist... try again?");

    if (!args.length) {
      const embed5 = new Discord.RichEmbed()
        .setTitle("**Here's a list of all my commands:**")
        .setThumbnail(bot.user.avatarURL);

      //data.push(commands.filter(c => !c.ownerOnly).map(command => '_`' + prefix + command.name + '`_' + ` - ${command.description}`).join('\n'));

      const groups = ["dev"];
      await groups.forEach(item => {
        let a = commands
          .filter(c => c.group === item)
          .map(
            command =>
              "_`" + config.prefix + command.name + "`_" + ` - ${command.description}`
          )
          .join("\n");
        embed5.addField(
          `**${item.charAt(0).toUpperCase() + item.slice(1)} commands:**`,
          a
        );
      });
      embed5.setColor(color.blue);
      //embed5.setDescription(data, { split: true });
      embed5.setFooter(
        `You can send "${config.prefix}dev-help [command name]" to get info on a specific command!`
      );

      return message.channel.send(embed5);
    }

    const name = args.shift().toLowerCase();
    const acommand = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));
    if (!acommand) {
      return message.reply(embed3);
    }

    data.push(`**Name:** ${acommand.name}`);

    if (acommand.aliases)
      data.push(`**Aliases:** ${acommand.aliases.join(", ")}`);
    if (acommand.description)
      data.push(`**Description:** ${acommand.description}`);
    if (acommand.usage)
      data.push(`**Usage:** ${config.prefix}${acommand.name} ${acommand.usage}`);

    const timeLeft = acommand.cooldown || 3;
    let hours = Math.floor(timeLeft / 3600);
    let r1 = timeLeft % 3600;
    let minutes = Math.floor(r1 / 60);
    let seconds = Math.floor(r1 % 60);

    let finalTime;

    if (hours !== 0 && minutes !== 0 && seconds !== 0) {
      finalTime = `${hours} hour(s), ${minutes} minute(s) and ${seconds} second(s)`;
    } else if (hours !== 0 && minutes !== 0 && seconds === 0) {
      finalTime = `${hours} hour(s) and ${minutes} minute(s)`;
    } else if (hours !== 0 && minutes === 0 && seconds === 0) {
      finalTime = `${hours} hour(s)`;
    } else if (hours !== 0 && minutes === 0 && seconds !== 0) {
      finalTime = `${hours} hour(s) and ${seconds} second(s)`;
    } else if (hours === 0 && minutes !== 0 && seconds !== 0) {
      finalTime = `${minutes} minute(s) and ${seconds} second(s)`;
    } else if (hours === 0 && minutes !== 0 && seconds === 0) {
      finalTime = `${minutes} minute(s)`;
    } else if (hours === 0 && minutes === 0 && seconds === 0) {
      finalTime = `Less than a second`;
    } else if (hours === 0 && minutes === 0 && seconds !== 0) {
      finalTime = `${seconds} second(s)`;
    } else {
      finalTime = "`You should not see this message, contact Sans ASAP!!!`";
    }

    data.push(`**Cooldown:** ${finalTime}`);

    const embed4 = new Discord.RichEmbed()
      .setColor(color.blue)
      .setDescription(data, { split: true });

    message.channel.send(embed4);
  }
};
