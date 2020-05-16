function clean(text) {
  if (typeof text === "string")
    return text
      .replace(/`/g, "`" + String.fromCharCode(8203))
      .replace(/@/g, "@" + String.fromCharCode(8203));
  else return text;
}

const Discord = require("discord.js");
const db = require('quick.db');

module.exports = {
  name: "eval",
  description: "Evaluates the given code and outputs the result.",
  group: "dev",
  cooldown: 0.1,
  ownerOnly: true,
  execute: async (message, args, bot, config, command, aargs) => {
    try {
      let code = args.join(" ");
      if (code.startsWith("```js") && code.endsWith("```")) {
        code = code.slice(5, -3);
      }

      let evaled = eval(code);

      if (typeof evaled !== "string") evaled = require("util").inspect(evaled);

      message.channel.send(clean(evaled), { code: "xl" });
    } catch (err) {
      console.log(err);
      message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
    }
  }
};
