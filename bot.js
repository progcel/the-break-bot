require('dotenv').config();
const cron = require('node-cron')
const discord = require('discord.js');
const ApiCaller = require('./apicaller');
const CommandHandler = require('./commandhandler');
const DatabaseHandler = require('./databasehandler');
const Tasks = require("./tasks");

const discordBot = new discord.Client();
const apiCaller = new ApiCaller();
const databaseHandler = new DatabaseHandler();
const commandHandler = new CommandHandler(apiCaller);

discordBot.on('ready', async () => {
  console.log('Bot is online!');

  const tasks = new Tasks(discordBot, apiCaller, databaseHandler);

  // At every 10th minute past every hour from 8 (UTC) through 20 (UTC)
  cron.schedule("*/10 8-20 * * *", async () => {
    await tasks.newVideoNotify();
  });
});

discordBot.on('message', async function (message) {
  let response = await commandHandler.handle(message.content);
  if (response) message.reply(response);
});

discordBot.login(process.env.BOT_TOKEN);
