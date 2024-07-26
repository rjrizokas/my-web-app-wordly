from aiogram import Bot, Dispatcher, types
from aiogram.utils import executor
import os

API_TOKEN = 'YOUR_API_TOKEN'

bot = Bot(token=API_TOKEN)
dp = Dispatcher(bot)

@dp.message_handler(commands=['start'])
async def start(message: types.Message):
    # Ваш код обработки команды /start...

async def on_startup(dp):
    print('Starting bot...')

async def on_shutdown(dp):
    print('Shutting down bot...')

if __name__ == '__main__':
    # Запускаем бота в режиме опроса
    executor.start_polling(dp, on_startup=on_startup, on_shutdown=on_shutdown)
