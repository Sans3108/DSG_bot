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
    
    const timeLeft = queue.musics[0].vid.duration
    
    let hours = timeLeft.hours
    let pre_minutes = timeLeft.minutes
    let minutes;
    if(pre_minutes < 10) {
      minutes = '0' + pre_minutes;
    } else {
      minutes = pre_minutes;
    }
    let pre_seconds = timeLeft.seconds
    let seconds;
    
    if(pre_seconds < 10) {
      seconds = '0' + pre_seconds;
    } else {
      seconds = pre_seconds;
    }

    let finalTime = `${hours}:${minutes}:${seconds}`

    const d = new Date(queue.musics[0].vid.publishedAt);
    const ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d)
    const mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(d)
    const da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d)
    
    let embed = new Discord.RichEmbed()
        .setColor(config.color.blue)
        .setAuthor(`🎵 Playing now:`, bot.user.displayAvatarURL)
        .setTitle(`**${queue.musics[0].title}**`)
        .setURL(`${queue.musics[0].url}`)
        .setDescription(`Duration: ${finalTime}\nChannel: ${queue.musics[0].vid.channel.title}\nPublished at: ${da}/${mo}/${ye}\n\n\`Requested by: ${queue.musics[0].reqBy}\``);
    
    try {
      embed.setThumbnail(queue.musics[0].vid.thumbnails.maxres.url);
    } catch {
      embed.setThumbnail('https://images-ext-2.discordapp.net/external/M2Br4GCCbWTisGsEnqUa-nCp2Kmkt4VZJTxs0uHKtbk/https/i.imgur.com/mBv92H7h.jpg?width=774&height=580');
     }
    
    message.channel.send(embed);
  }
};
