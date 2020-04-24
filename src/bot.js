require('dotenv').config();
const discord = require('discord.js');
const ApiCaller = require('./apicaller');
const CommandHandler = require('./commandhandler');
const DatabaseHandler = require('./databasehandler');
const Scheduler = require('./scheduler');

const discordBot = new discord.Client();
const apiCaller = new ApiCaller();
const databaseHandler = new DatabaseHandler();
const commandHandler = new CommandHandler(apiCaller);
const scheduler = new Scheduler(discordBot, apiCaller, databaseHandler);

discordBot.on('ready', async () => {
  console.log('Bot is online!');

  await scheduler.activate();
});

discordBot.on('message', async function (message) {
  let response = await commandHandler.handle(message.content);
  if (response) message.reply(response);
});

discordBot.login(process.env.BOT_TOKEN);
