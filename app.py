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

@app.route('/get_word', methods=['GET'])
def get_word():
    day_of_week = request.args.get('day_of_week', default='word1')
    return jsonify({day_of_week: words[day_of_week]})

@app.route('/update_word', methods=['POST'])
def update_word():
    data = request.json
    for key in data:
        if key in words:
            words[key] = data[key].upper()
    return jsonify({"status": "success", "words": words})

if __name__ == '__main__':
    app.run(debug=True)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)


