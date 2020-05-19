const Discord = require("discord.js");

module.exports = {
  name: "now-playing",
  description: "Check what song is currently playing!",
  group: 'music',
  aliases: ['np', 'nowplaying'],
  cooldown: 1,
  guildOnly: true,
  execute: async (message, args, bot, config, command, aargs) => {
    let queue = bot.queue.get(message.guild.id);
    
    let emb1 = new Discord.RichEmbed()
        .setColor(config.color.red)
        .setDescription('⚠ No music is being played!');
    if (!queue) return message.channel.send(emb1)
    
    let icon = message.guild.iconURL.slice(0, -3) + 'gif';
    
    let embed = new Discord.RichEmbed()
        .setColor(config.color.blue)
        .setThumbnail(icon)
        .setDescription(`🎵 **Playing now:**\n${queue.musics[0].title}\n\`Requested by: ${queue.musics[0].reqBy}\``);

    message.channel.send(embed);
  }
};