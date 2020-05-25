const Discord = require("discord.js");

module.exports = {
  name: "mutli-play",
  description: "Play multiple songs at a time! (Each argument is considered a search string, this command is best used with links)",
  aliases: ["mp"],
  group: "music",
  cooldown: 300,
  guildOnly: true,
  execute: async (message, args, bot, config, command, aargs) => {
    if(args[9]) return message.reply('you cannot queue more than 10 songs at a time.');
    
    args.forEach(async ITEM => {
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

      let url = ITEM ? ITEM.replace(/<(.+)>/g, "$1") : "";
      let pl = /^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/;

      let searchString = ITEM

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
        let emb3 = new Discord.RichEmbed()
          .setColor(config.color.green)
          .setDescription(`🎵 **${playlist.title}** was added to the queue!`);
        return message.channel.send(emb3);
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
              .setColor(config.color.green)
              .setDescription(`Couldn't find any match for: \`${searchString}\``);
            return message.channel.send(emb4);
          }
        }
        return bot.handleVideo(video, message, VC);
      }
    });
  }
};
