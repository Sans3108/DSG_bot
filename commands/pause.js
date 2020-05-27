const Discord = require("discord.js");

module.exports = {
  name: "pause",
  aliases: ['resume'],
  description: "Pause and unpause the music!",
  group: "music",
  cooldown: 2,
  guildOnly: true,
  execute: async (message, args, bot, config, command, aargs) => {
    let queue = bot.queue.get(message.guild.id);

    let VC = message.member.voiceChannel;

    let emb1 = new Discord.RichEmbed()
      .setColor(config.color.red)
      .setDescription(
        `Please join a channel to use this command! ${message.author}`
      );

    let emb2 = new Discord.RichEmbed()
      .setColor(config.color.red)
      .setDescription(
        `Please join the same channel as me to use this command! ${message.author}`
      );

    if (!VC) return message.channel.send(emb1);

    if (
      message.guild.me.voiceChannel &&
      VC.id !== message.guild.me.voiceChannel.id
    )
      return message.channel.send(emb2);

    if (
      message.member.hasPermission("ADMINISTRATOR") ||
      message.member.roles.find(r => r.name.toLowerCase() === "dj")
    ) {
      if (queue && queue.playing) {
        queue.playing = false;
        queue.connection.dispatcher.pause();

        let emb4 = new Discord.RichEmbed()
          .setColor(config.color.green)
          .setDescription(`🎵 Player paused.`);
        return message.channel.send(emb4);
      }

      if (queue && !queue.playing) {
        queue.playing = true;
        queue.connection.dispatcher.resume();

        let emb5 = new Discord.RichEmbed()
          .setColor(config.color.green)
          .setDescription(`🎵 Player resumed.`);
        return message.channel.send(emb5);
      }

      let emb6 = new Discord.RichEmbed()
        .setColor(config.color.green)
        .setDescription(`⚠ No music is being played!`);
      return message.channel.send(emb6);
    } else {
      let emb3 = new Discord.RichEmbed()
        .setColor(config.color.red)
        .setDescription(
          `You need the DJ role or the \`ADMINISTRATOR\` permission to use this command! ${message.author}`
        );
      return message.channel.send(emb3);
    }
  }
};
