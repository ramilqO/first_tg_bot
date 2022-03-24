const TelegramApi = require('node-telegram-bot-api');
const token = '5100709349:AAH4sEootC2t8S6FGXaJfropLfTt7RVEfAE';
const bot = new TelegramApi(token, {polling: true});
const {gameOptions, againOptions} = require('./options.js');

const chats = {}  //внутренние данные

const startGame = async (chatId) => { //начало игры
      await bot.sendMessage(chatId, 'Здесь тебе нужно угадать число от 1 до 10, которое загадал бот');

      const randomNum = Math.floor(Math.random() * 10) + 1;
      chats[chatId] = randomNum;

      await bot.sendMessage(chatId, 'Выбери число', gameOptions);
}

const start = () => {
  bot.setMyCommands([   //подсказки команд
    {command: '/start', description: 'Запустить бота'},
    {command: '/info', description: 'Показать информацию'},
    {command: '/game', description: 'Начать игру'}
]);

bot.on('message', async msg => {    //команды
  const text = msg.text;
  const chatId = msg.chat.id;
  const userName = msg.from.first_name;
  const userLastName = msg.from.last_name;

  if(text === '/start') {
     bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/f9d/8a4/f9d8a439-4d26-42e3-830d-6b6ba804c505/3.webp');
     return bot.sendMessage(chatId, 'Привет! Нажми /help, чтобы посмотреть, что я умею!');
  }

  if(text === '/help') {
    return bot.sendMessage(chatId,
     'Список доступных команд: /start - запустить бота. /info - информация о вас. /game - начать игру');
  }

  if(text === '/info') {
    return bot.sendMessage(chatId, `Вас зовут ${userName} ${userLastName}`);
  } 

  if(text === '/game') {
      return startGame(chatId);
  }

    return bot.sendMessage(chatId, 'Я тебя не понимаю, попробуй ещё раз...');

    })

      

      bot.on('callback_query', async msg => { //нажатие на варианты ответов и проверки
        const data = msg.data;
        const chatId = msg.message.chat.id;

        if(data === '/again') {
          return startGame(chatId);
        }

        if(data == chats[chatId]) {
          return bot.sendMessage(chatId, `Верно! Это было число ${data}`, againOptions)
        } if(data != chats[chatId]) {
          return bot.sendMessage(chatId, `Не угадали! Это было число ${chats[chatId]}`, againOptions);
        }
        
    })
}

  

start();
