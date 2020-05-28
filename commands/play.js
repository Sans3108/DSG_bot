const Discord = require("discord.js");

module.exports = {
  name: "play",
  description: "Play a song!",
  aliases: ["p"],
  group: "music",
  cooldown: 2,
  guildOnly: true,
  execute: async (message, args, bot, config, command, aargs) => {
    let VC = message.member.voiceChannel;

    let emb1 = new Discord.RichEmbed()
      .setColor(config.color.red)
      .setDescription(
        `Please join a channel to use this command! ${message.author}`
    );
    
    let emb5 = new Discord.RichEmbed()
      .setColor(config.color.red)
      .setDescription(
        `Please join the same channel as me to use this command! ${message.author}`
    );

    if (!VC) return message.channel.send(emb1);
    
    if (message.guild.me.voiceChannel && VC.id !== message.guild.me.voiceChannel.id) return message.channel.send(emb5);
    
    let queue = bot.queue.get(message.guild.id);
    let ret = false;
    if (queue) {
      let all = queue.musics.map(music => music.reqID);
      
      if(bot.f.arrayCount(message.author.id, all) > 2) {
        if (message.member.hasPermission('ADMINISTRATOR') || message.member.roles.find(r => r.name.toLowerCase() === "dj")) {
          console.log('Queue limit ignored for: ' + message.author.tag);
        } else {
          ret = true;
        }
      } else {
        console.log('Max queue songs not reached yet for: ' + message.author.tag);
      }
    } else {
      console.log('There is no queue, proceeding...')
    }
    let embErr = new Discord.RichEmbed()
      .setColor(config.color.red)
      .setDescription('You cannot have more than 3 songs in the queue at a time! ' + message.author);
    if(ret) return  message.channel.send(embErr);

    let url = args[0] ? args[0].replace(/<(.+)>/g, "$1") : "";
    let pl = /^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/;

    let searchString = args.join(" ");

    let emb2 = new Discord.RichEmbed()
      .setColor(config.color.red)
      .setDescription(
        `Please enter a valid URL or search string! ${message.author}`
      );
    if (!url || !searchString) return message.channel.send(emb2);

    let perms = VC.permissionsFor(bot.user);
    
    if (!perms.has("CONNECT"))
      return message.reply(
        "I do not have permissions to connect to voice channels!"
      );
    if (!perms.has("SPEAK"))
      return message.reply(
        "I do not have the permissions to speak in voice channels!"
      );

    if (url.match(pl)) {
      let playlist = await bot.youtube.getPlaylist(url);
      let videos = await playlist.getVideos();

      for (const vid of Object.values(videos)) {
        let video = await bot.youtube.getVideoByID(vid.id);
        await bot.handleVideo(video, message, VC, true);
      }
      const timeLeft = playlist.vid.duration
      let minutes = timeLeft.minutes
      let pre_seconds = timeLeft.seconds
      let seconds;
      if(pre_seconds < 10) {
        seconds = '0' + pre_seconds;
      } else {
        seconds = pre_seconds;
      }
      let finalTime = `${minutes}:${seconds}`;
      /*let emb3 = new Discord.RichEmbed()
        .setDescription(`🎵 **` + `[${playlist.title}](${playlist.url})` + `** was added to the queue!`)
        .setThumbnail(playlist.vid.thumbnails.maxres.url)
        .setColor(config.color.green)
        .setAuthor(`🎵 Added to queue:`, bot.user.displayAvatarURL)
        .setTitle(`**${playlist.title}**`)
        .setURL(`${playlist.url}`)
        .setDescription(`Duration: ${finalTime}\nChannel: ${playlist.vid.channel.title}`);*/
      return message.channel.send('Well this is awkward... You should not see this message. Please contact staff to solve this issue.')
    } else {
      try {
        var video = await bot.youtube.getVideo(url);
      } catch (err) {
        if (err) undefined;
        try {
          var vid = await bot.youtube.searchVideos(searchString, 1);
          var video = await bot.youtube.getVideoByID(vid[0].id);
        } catch (err) {
          console.error(err);

          let emb4 = new Discord.RichEmbed()
            .setColor(config.color.red)
            .setDescription(`Couldn't find any match for: \`${searchString}\``);
          return message.channel.send(emb4);
        }
      }
      return bot.handleVideo(video, message, VC);
    }
  }
};
