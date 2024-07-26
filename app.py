import os
import requests
import base64
import json
from flask import Flask, request, jsonify
from flask_cors import CORS
import datetime

app = Flask(__name__)
CORS(app)

GITHUB_TOKEN = os.getenv('GITHUB_TOKEN')
if not GITHUB_TOKEN:
    raise ValueError("GITHUB_TOKEN is not set. Please set the environment variable.")

REPO_OWNER = 'rjrizokas'
REPO_NAME = 'my-web-app-wordly'
WORDS_FILE_PATH_PLAYER1 = 'words.json'
WORDS_FILE_PATH_PLAYER2 = 'words1.json'
WORDLIST_FILE_PATH = 'wordlist.json'

# Функция для получения содержимого файла на GitHub
def get_github_file_content(file_path):
    url = f'https://api.github.com/repos/{REPO_OWNER}/{REPO_NAME}/contents/{file_path}'
    headers = {
        'Authorization': f'token {GITHUB_TOKEN}',
        'Accept': 'application/vnd.github.v3+json'
    }
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        content = response.json()
        file_content = base64.b64decode(content['content']).decode()
        return json.loads(file_content)
    else:
        response.raise_for_status()

# Функция для обновления содержимого файла на GitHub
def update_github_file_content(file_path, file_content):
    url = f'https://api.github.com/repos/{REPO_OWNER}/{REPO_NAME}/contents/{file_path}'
    headers = {
        'Authorization': f'token {GITHUB_TOKEN}',
        'Accept': 'application/vnd.github.v3+json'
    }
    file_content_base64 = base64.b64encode(file_content.encode()).decode()
    
    # Получаем текущий SHA для файла
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        sha = response.json().get('sha')
    else:
        response.raise_for_status()

    data = {
        'message': f'Update {file_path}',
        'content': file_content_base64,
        'sha': sha,  # SHA текущей версии файла
        'branch': 'main'
    }
    response = requests.put(url, headers=headers, json=data)
    if response.status_code == 200:
        return response.json()
    else:
        response.raise_for_status()

# Загрузка слов и списка допустимых слов
try:
    words_player1 = get_github_file_content(WORDS_FILE_PATH_PLAYER1)
    words_player2 = get_github_file_content(WORDS_FILE_PATH_PLAYER2)
    wordlist = get_github_file_content(WORDLIST_FILE_PATH)
except Exception as e:
    print(f"Failed to fetch words or wordlist: {e}")
    words_player1 = {}
    words_player2 = {}
    wordlist = []

@app.route('/get_word', methods=['GET'])
def get_word():
    player = request.args.get('player', 'player1')
    day_of_week = request.args.get('day_of_week', datetime.datetime.now().strftime('%A').lower())
    
    if player == 'player1':
        word = words_player1.get(day_of_week, "СЛОВО")
    elif player == 'player2':
        word = words_player2.get(day_of_week, "СЛОВО")
    else:
        return jsonify({"message": "Invalid player"}), 400
    
    return jsonify({"word": word})

@app.route('/get_wordlist', methods=['GET'])
def get_wordlist():
    return jsonify({"wordlist": wordlist})

@app.route('/update_word', methods=['POST'])
def update_word():
    player = request.json.get('player', 'player1')
    data = request.json.get('words', {})
    
    if player == 'player1':
        words = words_player1
        file_path = WORDS_FILE_PATH_PLAYER1
    elif player == 'player2':
        words = words_player2
        file_path = WORDS_FILE_PATH_PLAYER2
    else:
        return jsonify({"message": "Invalid player"}), 400
    
    for key in data:
        if key in words:
            words[key] = data[key]
    
    file_content = json.dumps(words, ensure_ascii=False)
    try:
        update_github_file_content(file_path, file_content)
        if player == 'player1':
            global words_player1
            words_player1 = words
        else:
            global words_player2
            words_player2 = words
        return jsonify({"message": "Words updated successfully!"})
    except Exception as e:
        print(f"Failed to update words: {e}")
        return jsonify({"message": "Error updating words!"}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
