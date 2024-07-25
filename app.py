from flask import Flask, request, jsonify
import os
import json

app = Flask(__name__)

# Путь к папке с данными
DATA_DIR = '/opt/render/project/src/data'
os.makedirs(DATA_DIR, exist_ok=True)

# Файл слов
WORDS_FILE = os.path.join(DATA_DIR, 'words.json')

# Функция для чтения слов из файла
def read_words_from_file():
    if os.path.exists(WORDS_FILE):
        with open(WORDS_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    return {}

# Функция для записи слов в файл
def write_words_to_file(words):
    with open(WORDS_FILE, 'w', encoding='utf-8') as f:
        json.dump(words, f, ensure_ascii=False, indent=4)

@app.route('/update_words', methods=['POST'])
def update_words():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Invalid data"}), 400

        # Запись обновленных слов в файл
        write_words_to_file(data)
        return jsonify({"success": True}), 200
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/get_word', methods=['GET'])
def get_word():
    try:
        day_of_week = request.args.get('day_of_week', 'monday').lower()
        all_words = read_words_from_file()

        word = all_words.get(day_of_week, "WORLD")  # Замените на ваше слово по умолчанию
        return jsonify({"word": word}), 200
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
