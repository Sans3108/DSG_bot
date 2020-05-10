const Discord = require("discord.js");
const { get } = require("snekfetch");

module.exports = {
  name: "fox",
  description: "Get a random fox :3",
  group: 'fun',
  cooldown: 2,
  guildOnly: true,
  execute: async (message, args, bot, config) => {
    let msg = await message.channel.send("Generating a fox...");
  try {
    get('https://randomfox.ca/floof').then(res => {
        const embed = new Discord.RichEmbed()
        .setColor(config.color.random)
        .setImage(res.body.image)
        .setTimestamp()
        .setFooter(`© ${bot.user.username}`, bot.user.avatarURL)

       return msg.edit('Look at this beautiful fox! :3', {embed})
    });
} catch(err) {
    return message.channel.send(err.stack)
}
  }
};