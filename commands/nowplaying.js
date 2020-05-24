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
    
    const timeLeft = queue.musics[0].vid.duration
    
    let minutes = timeLeft.minutes
    let pre_seconds = timeLeft.seconds
    let seconds;
    
    if(pre_seconds < 10) {
      seconds = '0' + pre_seconds;
    } else {
      seconds = pre_seconds;
    }

    let finalTime = `${minutes}:${seconds}`

    let embed = new Discord.RichEmbed()
        .setColor(config.color.blue)
        .setThumbnail(icon)
        .setAuthor(`🎵 Playing now:`, bot.user.displayAvatarURL)
        .setTitle(`**${queue.musics[0].title}**`)
        .setURL(`${queue.musics[0].url}`)
        .setDescription(`Duration: ${finalTime}\nChannel: ${queue.musics[0].vid.channel.title}\n\n\`Requested by: ${queue.musics[0].reqBy}\``);

    message.channel.send(embed);
  }
};