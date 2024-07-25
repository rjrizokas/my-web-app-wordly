from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Разрешить запросы с любого источника

current_word = "WHALE"

@app.route('/get_word', methods=['GET'])
def get_word():
    global current_word
    return jsonify({"word": current_word})

@app.route('/update_word', methods=['POST'])
def update_word():
    global current_word
    data = request.get_json()
    if 'word' in data:
        current_word = data['word'].upper()
        return jsonify({"status": "success"}), 200
    return jsonify({"status": "error", "message": "No word provided"}), 400

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)

