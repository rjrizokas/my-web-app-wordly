from flask import Flask, request, jsonify
from flask_cors import CORS


app = Flask(__name__)
CORS(app)

# Переменные для хранения слов
words = {
    "word1": "СЛОВО",
    "word2": "КНИГА",
    "word3": "СРЕДА",
    "word4": "БУКВА",
    "word5": "КРЕСТ",
    "word6": "ВЕСНА",
    "word7": "ЗВЕНО"
}

@app.route('/')
def index():
    return "Welcome to the Wordly API!"

@app.route('/get_word', methods=['GET'])
def get_word():
    day_of_week = request.args.get('day_of_week')
    word = words.get(day_of_week, "Not Found")
    return jsonify({"word": word})

@app.route('/update_word', methods=['POST'])
def update_word():
    data = request.json
    print("Received data:", data)  # Логирование полученных данных
    for key in data:
        if key in words:
            words[key] = data[key]
    return jsonify({"message": "Words updated successfully!"})


if __name__ == '__main__':
    app.run(debug=True)


