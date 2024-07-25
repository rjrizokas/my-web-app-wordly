from flask import Flask, request, jsonify
from flask_cors import CORS
import datetime
import requests
import json
import base64

app = Flask(__name__)
CORS(app)

# Настройки GitHub
GITHUB_TOKEN = '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'  # Замените на ваш реальный токен
REPO_OWNER = 'rjrizokas'  # Ваше имя пользователя на GitHub
REPO_NAME = 'my-web-app-wordly'  # Имя вашего репозитория
FILE_PATH = 'words.json'  # Путь к файлу в репозитории

GITHUB_API_URL = f'https://api.github.com/repos/{REPO_OWNER}/{REPO_NAME}/contents/{FILE_PATH}'

def get_github_headers():
    return {
        'Authorization': f'token {GITHUB_TOKEN}',
        'Accept': 'application/vnd.github.v3+json'
    }

def fetch_words_from_github():
    try:
        response = requests.get(GITHUB_API_URL, headers=get_github_headers())
        response.raise_for_status()  # Проверка на успешный запрос
        file_data = response.json()
        content = base64.b64decode(file_data['content']).decode('utf-8')
        return json.loads(content)
    except requests.RequestException as e:
        print(f'Error fetching words from GitHub: {e}')
        return {}

def update_words_on_github(words):
    try:
        # Получаем текущий SHA для обновления
        response = requests.get(GITHUB_API_URL, headers=get_github_headers())
        response.raise_for_status()
        file_data = response.json()
        sha = file_data['sha']

        # Обновляем файл
        content = json.dumps(words, ensure_ascii=False).encode('utf-8')
        b64_content = base64.b64encode(content).decode('utf-8')
        update_data = {
            'message': 'Update words.json',
            'content': b64_content,
            'sha': sha
        }
        response = requests.put(GITHUB_API_URL, headers=get_github_headers(), json=update_data)
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        print(f'Error updating words on GitHub: {e}')
        return {}

# Загрузка начальных данных
words = fetch_words_from_github()

@app.route('/get_word', methods=['GET'])
def get_word():
    # Если параметр day_of_week отсутствует, используем текущий день недели
    day_of_week = request.args.get('day_of_week', datetime.datetime.now().strftime('%A').lower())
    word = words.get(day_of_week, "SNAKE")
    return jsonify({"word": word})

@app.route('/update_word', methods=['POST'])
def update_word():
    global words
    data = request.json
    for key in data:
        if key in words:
            words[key] = data[key]
    update_words_on_github(words)
    return jsonify({"message": "Words updated successfully!"})

@app.route('/view_words', methods=['GET'])
def view_words():
    return jsonify(words)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
