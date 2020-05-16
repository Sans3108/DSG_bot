const Discord = require("discord.js");
const { get } = require("snekfetch");

module.exports = {
  name: "dog",
  description: "Get a random dog :3",
  group: "fun",
  cooldown: 3,
  guildOnly: true,
  execute: async (message, args, bot, config, command, aargs) => {
    let msg = await message.channel.send("Generating a dog...");
    try {
      get("https://random.dog/woof.json").then(res => {
        const embed = new Discord.RichEmbed()
          .setColor("RANDOM")
          .setDescription("No " + `[image](${res.body.url})` +"? Blame Discord...")
          .setImage(res.body.url)
          .setTimestamp()
          .setFooter(`© ${bot.user.username}`, bot.user.avatarURL);
        return msg.edit("Look at this beautiful dog! :3", { embed });
      });
    } catch (err) {
      return message.channel.send(err.stack);
    }
  }
};
