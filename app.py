from flask import Flask, request, jsonify
from flask_cors import CORS
import datetime

app = Flask(__name__)
CORS(app)

# Переменные для хранения слов
words = {
    "monday": "WORLD",
    "tuesday": "PLANE",
    "wednesday": "STAKE",
    "thursday": "BROWN",
    "friday": "SWEET",
    "saturday": "BLIND",
    "sunday": "STONE"
}

@app.route('/get_word', methods=['GET'])
def get_word():
    # Если параметр day_of_week отсутствует, используем текущий день недели
    day_of_week = request.args.get('day_of_week', datetime.datetime.now().strftime('%A').lower())
    word = words.get(day_of_week, "SNAKE")
    return jsonify({"word": word})  # Возвращаем ответ с корректным кодированием

@app.route('/update_word', methods=['POST'])
def update_word():
    data = request.json
    for key in data:
        if key in words:
            words[key] = data[key]
    return jsonify({"message": "Words updated successfully!"})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
