import subprocess
import os

# Запускаем Flask-приложение с помощью gunicorn
subprocess.Popen(["gunicorn", "app:app", "--bind", "0.0.0.0:5000"])

# Запускаем Telegram-бота
subprocess.Popen(["python", "main.py"])
