const Discord = require("discord.js");
const { get } = require("snekfetch");

module.exports = {
  name: "cat",
  description: "Get a random cat :3",
  group: "fun",
  cooldown: 3,
  guildOnly: true,
  execute: async (message, args, bot, config, command, aargs) => {
    let msg = await message.channel.send("Generating a cat...");
    try {
      get("https://aws.random.cat/meow").then(res => {
        const embed = new Discord.RichEmbed()
          .setColor("RANDOM")
          .setDescription("No " + `[image](${res.body.file})` +"? Blame Discord...")
          .setImage(res.body.file)
          .setTimestamp()
          .setFooter(`© ${bot.user.username}`, bot.user.avatarURL);
        return msg.edit("Look at this beautiful cat! :3", { embed });
      });
    } catch (err) {
      return message.channel.send(err.stack);
    }
  }
};
