from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os
import datetime

app = Flask(__name__)
CORS(app)

# Путь к файлу words.json
words_file_path = os.path.join(os.path.dirname(__file__), 'words.json')

# Функция для чтения слов из файла
def read_words_from_file():
    try:
        with open(words_file_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        return {
            "monday": "ПЕСНЯ",
            "tuesday": "КОСТЬ",
            "wednesday": "СФЕРА",
            "thursday": "ЛЕВША",
            "friday": "УГОРЬ",
            "saturday": "БРОНЬ",
            "sunday": "МЕСТО"
        }

# Функция для записи слов в файл
def write_words_to_file(words):
    with open(words_file_path, 'w', encoding='utf-8') as f:
        json.dump(words, f, ensure_ascii=False, indent=4)

@app.route('/get_word', methods=['GET'])
def get_word():
    words = read_words_from_file()
    day_of_week = request.args.get('day_of_week', datetime.datetime.now().strftime('%A').lower())
    word = words.get(day_of_week, "ЛЕНТА")
    return jsonify({"word": word})

@app.route('/update_word', methods=['POST'])
def update_word():
    data = request.json
    words = read_words_from_file()
    for key in data:
        if key in words:
            words[key] = data[key]
    write_words_to_file(words)
    return jsonify({"message": "Words updated successfully!"})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)

