from aiogram import Bot, Dispatcher, executor, types
from aiogram.types.web_app_info import WebAppInfo

bot = Bot('7439794203:AAEQGaP_uSsTh7c5onzP1VMrLo9VO1rmmtk')
dp = Dispatcher(bot)

allowed_users1 = ["vio_goncharova", "nft337"]
allowed_users2 = ["rjrizo", "nft337"]



@dp.message_handler(commands=['start'])
async def start(message: types.Message):
    markup = types.ReplyKeyboardMarkup()

    # Кнопка для всех пользователей
    markup.add(types.KeyboardButton('слово от RJ', web_app=WebAppInfo(
        url='https://rjrizokas.github.io/my-web-app-wordly/wordle.html')))

    # Кнопка для всех пользователей
    markup.add(types.KeyboardButton('слово от Ви', web_app=WebAppInfo(
        url='https://rjrizokas.github.io/my-web-app-wordly/wordle1.html')))

    # Кнопка "загадать слово от RJ" только для пользователей с ником "rjrizo" и "viorika"
    if message.from_user.username in allowed_users2:
        markup.add(types.KeyboardButton('загадать слово от RJ', web_app=WebAppInfo(
            url='https://rjrizokas.github.io/my-web-app-wordly/update.html')))

    # Кнопка "загадать слово от Ви" только для пользователей с ником "rjrizo" и "viorika"
    if message.from_user.username in allowed_users1:
        markup.add(types.KeyboardButton('загадать слово от Ви', web_app=WebAppInfo(
            url='https://rjrizokas.github.io/my-web-app-wordly/update1.html')))

    await message.answer('Что наша жизнь?', reply_markup=markup)


executor.start_polling(dp)
