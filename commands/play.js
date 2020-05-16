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

    if (!VC) return message.channel.send(emb1);

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
  }
};
