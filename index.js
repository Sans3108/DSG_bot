require("dotenv").config();
console.log('Loading...\n\n');

//A hella ot of variables goddamnit xd
const Discord = require("discord.js");
const config = require("./config.json");
const fs = require("fs");
const ms = require("ms");
const YouTubeAPIKey = process.env.YTKEY
const YouTube = require('simple-youtube-api');
const ytdl = require('ytdl-core');

const bot = new Discord.Client(); //disable @everyone and @here mentions by adding this as a client option     {disableEveryone: true}
bot.commands = new Discord.Collection();

const commandFiles = fs
  .readdirSync("./commands")
  .filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  bot.commands.set(command.name, command);
}

const cooldowns = new Discord.Collection();

//Ready event
bot.on("ready", async () => {
  let sans = await bot.fetchUser("366536353418182657");
  let aurelian = await bot.fetchUser("350690201267339269");

  console.log(
    `Tag: ${bot.user.tag}\nDevelopers: ${aurelian.tag} & ${sans.tag}`
  );
  bot.user.setPresence({
    game: {
      name: "DubstepGutter",
      type: "LISTENING"
    }
  });
});

//Message event
bot.on("message", async message => {
  if (
    message.content === "```xl\nPromise { <pending> }\n```" &&
    message.author.id === bot.user.id
  ) {
    message.delete();
  }

  //Message filter
  if (message.author.bot) return;
  if (!message.content.startsWith(config.prefix)) return;

  //const args = message.content.slice(config.prefix.length).split(/ +/); //message.content.substring(prefix.length).split(/ +/);
  let args = message.content
    .slice(config.prefix.length)
    .trim()
    .split(" ");
  let prefix = config.prefix
  const aargs = message.content.slice(prefix.length).split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command =
    bot.commands.get(commandName) ||
    bot.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

  if (!command) return;
  if (command.ownerOnly && message.author.id !== config.ownerID) return;
  if (command.guildOnly && message.channel.type !== "text") return;

  if (command.args && !args.length) {
    let reply = new Discord.RichEmbed()
      .setColor(config.color.red)
      .setDescription(`You didn't provide any arguments, ${message.author}!`);

    if (command.usage) {
      reply.setDescription(
        `You didn't provide any arguments, ${message.author}!\nThis would be the proper usage: \`${config.prefix}${command.name} ${command.usage}\``
      );
    }

    return message.channel.send(reply);
  }

  if (!cooldowns.has(command.name)) {
    cooldowns.set(command.name, new Discord.Collection());
  }

  const now = Date.now();
  const timestamps = cooldowns.get(command.name);
  const cooldownAmount = (command.cooldown || 3) * 1000;

  if (timestamps.has(message.author.id)) {
    const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000;
      let hours = Math.floor(timeLeft / 3600);
      let r1 = timeLeft % 3600;
      let minutes = Math.floor(r1 / 60);
      let seconds = Math.floor(r1 % 60);

      let finalTime;

      if (hours !== 0 && minutes !== 0 && seconds !== 0) {
        finalTime = `${hours} hour(s), ${minutes} minute(s) and ${seconds} second(s)`;
      } else if (hours !== 0 && minutes !== 0 && seconds === 0) {
        finalTime = `${hours} hour(s) and ${minutes} minute(s)`;
      } else if (hours !== 0 && minutes === 0 && seconds === 0) {
        finalTime = `${hours} hour(s)`;
      } else if (hours !== 0 && minutes === 0 && seconds !== 0) {
        finalTime = `${hours} hour(s) and ${seconds} second(s)`;
      } else if (hours === 0 && minutes !== 0 && seconds !== 0) {
        finalTime = `${minutes} minute(s) and ${seconds} second(s)`;
      } else if (hours === 0 && minutes !== 0 && seconds === 0) {
        finalTime = `${minutes} minute(s)`;
      } else if (hours === 0 && minutes === 0 && seconds === 0) {
        finalTime = `${seconds} second(s)`;
      } else if (hours === 0 && minutes === 0 && seconds !== 0) {
        finalTime = `${seconds} second(s)`;
      } else {
        finalTime = "`You should not see this message, contact staff ASAP!!!`";
      }

      let cooldownembed = new Discord.RichEmbed()
        .setColor(config.color.red)
        .setDescription(
          `(Cooldown) Please wait ${finalTime} before reusing the \`${command.name}\` command.`
        );

      return message.channel.send(cooldownembed);
    }
  }

  timestamps.set(message.author.id, now);
  setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

  try {
    command.execute(message, args, bot, config, command);
  } catch (error) {
    console.error(error);

    const erremb = new Discord.RichEmbed()
      .setColor(config.color.red)
      .setDescription(
        `Sorry, there was an error, please contact staff...\nThe error looks like this:\n\`\`\`${error}\`\`\``
      );

    message.channel.send(erremb);
  }
});

//Bot login
bot.login(process.env.TOKEN);

bot.on("error", console.error);
