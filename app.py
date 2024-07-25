from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Словарь для хранения слов для каждого дня недели
words = {
    "monday": "SNAKE",
    "tuesday": "SNAKE",
    "wednesday": "SNAKE",
    "thursday": "SNAKE",
    "friday": "SNAKE",
    "saturday": "SNAKE",
    "sunday": "SNAKE"
}

@app.route('/update_words', methods=['POST'])
def update_words():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400

        for day in words.keys():
            if day in data:
                words[day] = data[day]

        return jsonify({"success": "Words updated successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/get_word', methods=['GET'])
def get_word():
    # Вернем слово для текущего дня недели
    import datetime
    day_of_week = datetime.datetime.now().strftime('%A').lower()
    return jsonify({"word": words.get(day_of_week, "SNAKE")})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)


