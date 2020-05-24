const Discord = require("discord.js");

module.exports = {
  name: "ping",
  description: "PONG! :ping_pong:",
  group: 'general',
  cooldown: 1,
  guildOnly: false,
  execute: async (message, args, bot, config, command, aargs) => {
    const embed1 = new Discord.RichEmbed()
      .setColor(config.color.blue)
      .setDescription("Pinging...");
    
    if(bot.f.chance(5)) {
      // Easter eggs for the win baby :)
      message.channel.send(embed1).then(sent => {
      const embed1Edit = new Discord.RichEmbed()
        .setColor(config.color.green)
        .setDescription(
          `Pong! :ping_pong:\n\n:person_running: Response Time: OVER 9000ms\n:clock4: API: Infinite ms`
        );

      sent.edit(embed1Edit);
    });
      
    } else {
      message.channel.send(embed1).then(sent => {
      const embed1Edit = new Discord.RichEmbed()
        .setColor(config.color.green)
        .setDescription(
          `Pong! :ping_pong:\n\n:person_running: Response Time: ${sent.createdTimestamp -
            message.createdTimestamp}ms\n:clock4: API: ${Math.floor(
            bot.ping
          )}ms`
        );

      sent.edit(embed1Edit);
    });
    }
  }
};
