const Discord = require("discord.js");

module.exports = {
  name: "morse",
  description: "Translate text into morse!",
  group: 'fun',
  cooldown: 1,
  guildOnly: true,
  args: true,
  execute: async (message, args, bot, config) => {
    let alpha = " ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890".split(""),
				morse = "/,.-,-...,-.-.,-..,.,..-.,--.,....,..,.---,-.-,.-..,--,-.,---,.--.,--.-,.-.,...,-,..-,...-,.--,-..-,-.--,--..,.----,..---,...--,....-,.....,-....,--...,---..,----.,-----".split(","),
				text = args.join(" ").toUpperCase();
			while (text.includes("Ä") || text.includes("Ö") || text.includes("Ü")) {
				text = text.replace("Ä","AE").replace("Ö","OE").replace("Ü","UE");
			}
			if (text.startsWith(".") || text.startsWith("-")) {
				text = text.split(" ");
				let length = text.length;
				for (i = 0; i < length; i++) {
					text[i] = alpha[morse.indexOf(text[i])];
				}
				text = text.join("");
			} else {
				text = text.split("");
				let length = text.length;
				for (i = 0; i < length; i++) {
					text [i] = morse[alpha.indexOf(text[i])];
				}
				text = text.join(" ");
			}
      
            let emb1 = new Discord.RichEmbed()
                .setColor(config.color.green)
                .setDescription("```"+text+"```");
			return message.reply(emb1);
  }
};