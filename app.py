from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os

app = Flask(__name__)
CORS(app)

WORDS_FILE_PATH = '/opt/render/project/src/words.json'

def initialize_words():
    # Начальные значения слов на русском языке
    initial_words = {
        "roman": {
            "monday": "МАЛИНА",
            "tuesday": "КОШКА",
            "wednesday": "КОШКА",
            "thursday": "ГРУША",
            "friday": "КОШКА",
            "saturday": "КОШКА",
            "sunday": "КОШКА"
        },
        "viorica": {
            "monday": "КНИГА",
            "tuesday": "КНИГА",
            "wednesday": "НОСОК",
            "thursday": "КНИГА",
            "friday": "КНИГА",
            "saturday": "КНИГА",
            "sunday": "КНИГА"
        },
        "artem": {
            "monday": "САПОГ",
            "tuesday": "САПОГ",
            "wednesday": "САПОГ",
            "thursday": "САПОГ",
            "friday": "САПОГ",
            "saturday": "САПОГ",
            "sunday": "САПОГ"
        },
        "irina": {
            "monday": "БЕДРО",
            "tuesday": "БЕДРО",
            "wednesday": "БЕДРО",
            "thursday": "БЕДРО",
            "friday": "БЕДРО",
            "saturday": "БЕДРО",
            "sunday": "БЕДРО"
        },
        "elena": {
            "monday": "КНИГА",
            "tuesday": "КНИГА",
            "wednesday": "КНИГА",
            "thursday": "САХАР",
            "friday": "КНИГА",
            "saturday": "ЛАМПА",
            "sunday": "КНИГА"
        }
    }
    with open(WORDS_FILE_PATH, 'w', encoding='utf-8') as f:
        json.dump(initial_words, f, indent=4, ensure_ascii=False)

def load_words():
    if not os.path.exists(WORDS_FILE_PATH):
        initialize_words()
    with open(WORDS_FILE_PATH, 'r', encoding='utf-8') as f:
        return json.load(f)

def save_words(words):
    with open(WORDS_FILE_PATH, 'w', encoding='utf-8') as f:
        json.dump(words, f, indent=4, ensure_ascii=False)

words = load_words()

@app.route('/get_word', methods=['GET'])
def get_word():
    member = request.args.get('member', 'roman')
    day_of_week = request.args.get('day_of_week', 'monday')
    member_words = words.get(member, {})
    word = member_words.get(day_of_week, "СЛОВО")
    return jsonify({"word": word})

@app.route('/update_word', methods=['POST'])
def update_word():
    data = request.json
    for member, member_words in data.items():
        if member in words:
            words[member].update(member_words)
        else:
            words[member] = member_words
    save_words(words)
    return jsonify({"message": "Words updated successfully!"})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
