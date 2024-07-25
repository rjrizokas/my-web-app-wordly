from flask import Flask, request, jsonify
from flask_cors import CORS
import datetime

app = Flask(__name__)
CORS(app)

# Переменные для хранения слов
words = {
    "monday": "СЛОВО",
    "tuesday": "КНИГА",
    "wednesday": "СРЕДА",
    "thursday": "БУКВА",
    "friday": "КРЕСТ",
    "saturday": "ВЕСНА",
    "sunday": "ЗВЕНО"
}

@app.route('/get_word', methods=['GET'])
def get_word():
    # Вернем слово для текущего дня недели
    day_of_week = datetime.datetime.now().strftime('%A').lower()
    word = words.get(day_of_week, "SNAKE")
    return jsonify({"word": word}, ensure_ascii=False)  # Обновлено для возврата кириллицы

@app.route('/update_word', methods=['POST'])
def update_word():
    data = request.json
    for key in data:
        if key in words:
            words[key] = data[key]
    return jsonify({"message": "Words updated successfully!"}, ensure_ascii=False)  # Обновлено для возврата кириллицы

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
