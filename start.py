import subprocess
import sys

# Проверяем, что все зависимости установлены
subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])

# Запускаем Flask-приложение
subprocess.Popen(["gunicorn", "app:app", "--bind", "0.0.0.0:5000"])

# Запускаем Telegram-бота
subprocess.Popen(["python", "main.py"])
