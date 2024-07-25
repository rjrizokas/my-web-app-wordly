from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Словарь для хранения слов для каждого дня недели
words = {
    "monday": "word1",
    "tuesday": "word2",
    "wednesday": "word3",
    "thursday": "word4",
    "friday": "word5",
    "saturday": "word6",
    "sunday": "word7"
}

@app.route('/get_word', methods=['GET'])
def get_word():
    day = request.args.get('day', 'monday').lower()
    word = words.get(day, "default")
    return jsonify({'word': word})

@app.route('/update_word', methods=['POST'])
def update_word():
    data = request.json
    day = data.get('day', 'monday').lower()
    new_word = data.get('word', '')
    if day in words:
        words[day] = new_word
        return jsonify({'status': 'success', 'word': new_word})
    else:
        return jsonify({'status': 'error', 'message': 'Invalid day'}), 400

if __name__ == '__main__':
    app.run(debug=True)
    
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)

