import sqlite3
from datetime import datetime

def reset_progress():
    conn = sqlite3.connect('wordly.db')
    cursor = conn.cursor()

    # Устанавливаем текущее слово
    cursor.execute('SELECT word FROM daily_word WHERE date = ?', (datetime.now().date(),))
    row = cursor.fetchone()
    if not row:
        # Если для сегодняшнего дня нет слова, добавляем его (замените 'NEWWORD' на ваше слово)
        cursor.execute('INSERT INTO daily_word (word, date) VALUES (?, ?)', ('NEWWORD', datetime.now().date()))

    # Сбрасываем прогресс пользователей
    cursor.execute('UPDATE user_progress SET progress = "", last_updated = ?', (datetime.now().date(),))

    conn.commit()
    conn.close()

if __name__ == '__main__':
    reset_progress()
