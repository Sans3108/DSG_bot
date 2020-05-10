const Discord = require("discord.js");

module.exports = {
  name: "8ball",
  description: "Ask the 8 ball any question and get an answer!",
  group: "fun",
  cooldown: 1,
  guildOnly: true,
  execute: async (message, args, bot, config) => {
    if (!args[1]) {
      let emb1 = new Discord.RichEmbed()
        .setColor(config.color.red)
        .setDescription(
          "Please enter a full question with 2 or more words! " + message.author
        );

      return message.channel.send(emb1);
    }

    let replies = [
      ":8ball: Absolutely.",
      ":8ball: Absolutely not.",
      ":8ball: It is true.",
      ":8ball: Impossible.",
      ":8ball: Of course.",
      ":8ball: I do not think so.",
      ":8ball: It is true.",
      ":8ball: It is not true.",
      ":8ball: I am very undoubtful of that.",
      ":8ball: I am very doubtful of that.",
      ":8ball: Sources point to no.",
      ":8ball: Theories prove it.",
      ":8ball: Reply hazy try again",
      ":8ball: Ask again later",
      ":8ball: Better not tell you now",
      ":8ball: Cannot predict now",
      ":8ball: Concentrate and ask again",
      ":8ball: Yes",
      ":8ball: No",
      ":8ball: I don't know",
      ":8ball: Ask again later.",
      ":8ball: I am not sure.",
      ":8ball: You tell me",
      ":8ball: Without a doubt",
      ":8ball: Cannot predict now",
      ":8ball: Without a doubt"
    ];
    let result = Math.floor(Math.random() * replies.length);
    let question = args.join(" ");

    let ballembed = new Discord.RichEmbed()

      .setAuthor(message.author.username)
      .setColor(config.color.random)
      .addField("Question", question)
      .addField("Answer", replies[result])
      .setTimestamp()
      .setFooter(`© ${bot.user.username}`, bot.user.avatarURL);

    message.channel.send(ballembed);
  }
};
