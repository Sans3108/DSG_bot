const Discord = require("discord.js");
const db = require('quick.db');

module.exports = {
  name: "stop",
  description: "Stops the playback and leaves the channel!",
  aliases: ["leave", "fuckoff"],
  group: "music",
  cooldown: 1,
  guildOnly: true,
  disabled: true,
  execute: async (message, args, bot, config, command, aargs) => {
    let queue = bot.queue.get(message.guild.id);
    let emb1 = new Discord.RichEmbed()
      .setColor(config.color.red)
      .setDescription("⚠ No music is being played!");
    if (!queue) return message.channel.send(emb1);

    if (
      message.member.hasPermission("ADMINISTRATOR") ||
      message.member.roles.find(r => r.name.toLowerCase() === "dj")
    ) {
      queue.musics = [];
      queue.connection.dispatcher.end();
    
      let s = db.fetch('CONFIG');
      s.skipVotes = 0;
      db.set('CONFIG', s);

      return;
    } else {
      let emb2 = new Discord.RichEmbed()
        .setColor(config.color.red)
        .setDescription(
          `You need the DJ role or the \`ADMINISTRATOR\` permission to use this command! ${message.author}`
        );
      return message.channel.send(emb2);
    }
  }
};
