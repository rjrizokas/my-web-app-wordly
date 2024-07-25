from flask import Flask, request, jsonify
from flask_cors import CORS
import datetime
import json
import os

app = Flask(__name__)
CORS(app)

# Путь к файлу words.json
WORDS_FILE = 'words.json'

# Функция для чтения слов из файла
def read_words():
    if not os.path.exists(WORDS_FILE):
        return {
            "monday": "ПЕСНЯ",
            "tuesday": "КОСТЬ",
            "wednesday": "СФЕРА",
            "thursday": "ЛЕВША",
            "friday": "УГОРЬ",
            "saturday": "БРОНЬ",
            "sunday": "МЕСТО"
        }
    with open(WORDS_FILE, 'r', encoding='utf-8') as file:
        return json.load(file)

# Функция для записи слов в файл
def write_words(words):
    with open(WORDS_FILE, 'w', encoding='utf-8') as file:
        json.dump(words, file, ensure_ascii=False, indent=4)

@app.route('/get_word', methods=['GET'])
def get_word():
    words = read_words()
    day_of_week = request.args.get('day_of_week', datetime.datetime.now().strftime('%A').lower())
    word = words.get(day_of_week, "ГОНКА")
    return jsonify({"word": word})

@app.route('/update_word', methods=['POST'])
def update_word():
    data = request.json
    words = read_words()
    for key in data:
        if key in words:
            words[key] = data[key]
    write_words(words)
    return jsonify({"message": "Words updated successfully!"})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
