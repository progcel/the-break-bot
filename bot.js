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
const tasks = new Tasks(discordBot, apiCaller, databaseHandler);

discordBot.on('ready', async () => {
  console.log('Bot is online!');

  // At every 10th minute past every hour from 9 (UTC) through 20 (UTC)
  cron.schedule("*/10 9-20 * * *", async () => {
    await tasks.newVideoNotify();
  });
});

discordBot.on('message', async function (message) {
  let response = await commandHandler.handle(message.content);
  if (response) message.reply(response);
});

discordBot.login(process.env.BOT_TOKEN);
