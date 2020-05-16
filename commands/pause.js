const Discord = require("discord.js");

module.exports = {
  name: "pause",
  description: "Pause and unpause the music!",
  group: "music",
  cooldown: 2,
  guildOnly: true,
  execute: async (message, args, bot, config, command, aargs) => {
    let queue = bot.queue.get(message.guild.id);

    if (queue && queue.playing) {
      queue.playing = false;
      queue.connection.dispatcher.pause();

      let emb1 = new Discord.RichEmbed()
        .setColor(config.color.green)
        .setDescription(`🎵 Player paused.`);
      return message.channel.send(emb1);
    }

    if (queue && !queue.playing) {
      queue.playing = true;
      queue.connection.dispatcher.resume();

      let emb2 = new Discord.RichEmbed()
        .setColor(config.color.green)
        .setDescription(`🎵 Player resumed.`);
      return message.channel.send(emb2);
    }

    let emb3 = new Discord.RichEmbed()
      .setColor(config.color.green)
      .setDescription(`⚠ No music is being played!`);
    return message.channe.send(emb3);
  }
};
