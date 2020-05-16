const Discord = require("discord.js");

const mapping = '¡"#$%⅋,)(*+\'-˙/0ƖᄅƐㄣϛ9ㄥ86:;<=>?@∀qƆpƎℲפHIſʞ˥WNOԀQɹS┴∩ΛMX⅄Z[/]^_`ɐqɔpǝɟƃɥᴉɾʞlɯuodbɹsʇnʌʍxʎz{|}~';
// Start with the character '!'
const OFFSET = '!'.charCodeAt(0);

module.exports = {
  name: "fliptext",
  aliases: ['flip'],
  description: "Flip text upside down!",
  group: 'fun',
  cooldown: 1,
  guildOnly: true,
  args: true,
  execute: async (message, args, bot, config, command, aargs) => {
    
    let emb1 = new Discord.RichEmbed()
      .setColor(config.color.green)
      .setDescription(args.join(' ').split('').map(c => c.charCodeAt(0) - OFFSET).map(c => mapping[c] || ' ').reverse().join(''));
    
    message.reply(emb1);
  }
};