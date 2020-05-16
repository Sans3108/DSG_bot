const Discord = require("discord.js");

function flipcoin() {
  var rand = ['Tails.', 'Heads.'];
  return rand[Math.floor(Math.random()*rand.length)];
}

module.exports = {
  name: "coinflip",
  description: "Heads or Tails?",
  group: 'fun',
  cooldown: 1,
  guildOnly: true,
  execute: async (message, args, bot, config, command, aargs) => {
    message.channel.send('Fliping coin...').then((msg)=> {
        setTimeout(function(){
            msg.edit(flipcoin());
        }, 2500)
    });
  }
};