const Discord = require("discord.js");
const os = require("os");
const cpuStat = require("cpu-stat");
const moment = require("moment");

module.exports = {
  name: "stats",
  description: "Check out my stats!",
  group: "info",
  cooldown: 3,
  guildOnly: true,
  execute: async (message, args, bot, config) => {

    cpuStat.usagePercent(function(err, percent, seconds) {
      if (err) {
        return console.log(err);
      }
      
      let totalSeconds = bot.uptime / 1000;
      let days = Math.floor(totalSeconds / 86400);
      totalSeconds %= 86400;
      let hours = Math.floor(totalSeconds / 3600);
      totalSeconds %= 3600;
      let mins = Math.floor(totalSeconds / 60);
      let secs = Math.floor(totalSeconds % 60);

      //let duration = moment.duration(bot.uptime).format(" D [days], H [hrs], m [mins], s [secs]");
      let embedStats = new Discord.RichEmbed()
        .setTitle("*** Stats ***")
        .setColor("#00ff00")
        .addField(
          "Mem Usage",
          `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} / ${(
            os.totalmem() /
            1024 /
            1024
          ).toFixed(2)} MB`,
          true
        )
        .addField("Uptime ", `${days}d ${hours}h ${mins}m`, true) //`${duration}`, true)
        .addField("Servers", `${bot.guilds.size.toLocaleString()}`)
        .addField("Users", `${bot.users.size.toLocaleString()}`, true)
        .addField("Running on Node", `${process.version}`, true)
        .addField(
          "CPU",
          `\`\`\`md\n${os.cpus().map(i => `${i.model}`)[0]}\`\`\``
        )
        .addField("CPU used", `\`${percent.toFixed(2)}%\``, true)
        .addField("Arch", `\`${os.arch()}\``, true)
        .addField("Platform", `\`\`${os.platform()}\`\``, true)
        .setTimestamp()
        .setFooter(`© ${bot.user.username}`, bot.user.avatarURL);

      message.channel.send(embedStats);
    });
  }
};
