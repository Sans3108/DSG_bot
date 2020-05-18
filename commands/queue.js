const Discord = require("discord.js");

module.exports = {
  name: "queue",
  description: "Check the current queue!",
  group: 'music',
  aliases: ['q'],
  cooldown: 2,
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
        .setDescription(`**<<< Music Queue >>>**\n${queue.musics.map(music => 
            `**-** ${music.title}`).join('\n')}\n\n🎵 **Currently listening to:\n** ${queue.musics[0].title}`);

    message.channel.send(embed);
  }
};