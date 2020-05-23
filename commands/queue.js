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
        .setTitle('**<<< Music Queue >>>**')
        .setDescription(`🎵 **Currently listening to:\n** ` + `[${queue.musics[0].title}](${queue.musics[0].url})` +` \`Requested by: ${queue.musics[0].reqBy}\`\n\n**__Next up:__**\n${queue.musics.map(music => `**-** ` + `[${music.title}](${music.url})` + ` \`Requested by: ${music.reqBy}\``).slice(1).join('\n')}`);

    message.channel.send(embed);
  }
};