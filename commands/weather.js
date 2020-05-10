const Discord = require("discord.js");
const weather = require("weather-js");

module.exports = {
  name: "weather",
  description: "Check the weather!",
  group: "general",
  cooldown: 1,
  guildOnly: true,
  args: true,
  execute: async (message, args, bot, config) => {
    weather.find({ search: args.join(" "), degreeType: "C" }, function(
      err,
      result
    ) {
      if (err) message.channel.send(err);
      //If the place entered is invalid
      if (result.length === 0) {
        let emb1 = new Discord.RichEmbed()
          .setColor(config.color.red)
          .setDescription(`No result found for \`${args.join(' ')}\`! ${message.author}`);
        
        message.channel.send(emb1);
        return;
      }

      //Variables
      var current = result[0].current;
      var location = result[0].location;

      //Sends weather log in embed
      let embed = new Discord.RichEmbed()
        .setDescription(`**${current.skytext}**`)
        .setAuthor(`Weather for ${current.observationpoint}`)
        .setThumbnail(current.imageUrl)
        .setColor(0x00ae86)
        .addField("Timezone", `UTC${location.timezone}`, true) //Shows the timezone
        .addField("Degree Type", location.degreetype, true) //Shows the degrees in Celcius
        .addField("Temperature", `${current.temperature}`, true)
        .addField("Feels like", `${current.feelslike} Degrees`, true)
        .addField("Winds", current.winddisplay, true)
        .addField("Humidity", ` ${current.humidity}%`, true)
        .addField("Day", `${current.day}`, true)
        .addField("Date", `${current.date}`, true);

      message.channel.sendEmbed(embed);
    });

    //message.delete();
  }
};
