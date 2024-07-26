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
        'message': 'Update words file',
        'content': file_content_base64,
        'sha': sha,  # SHA текущей версии файла
        'branch': 'main'
    }
    response = requests.put(url, headers=headers, json=data)
    if response.status_code == 200:
        return response.json()
    else:
        response.raise_for_status()

# Загрузка слов для первого игрока
try:
    words = get_github_file_content('words.json')
except Exception as e:
    print(f"Failed to fetch words: {e}")
    words = {}

# Загрузка слов для второго игрока
try:
    words1 = get_github_file_content('words1.json')
except Exception as e:
    print(f"Failed to fetch words1: {e}")
    words1 = {}

@app.route('/get_word', methods=['GET'])
def get_word():
    day_of_week = request.args.get('day_of_week', datetime.datetime.now().strftime('%A').lower())
    word = words.get(day_of_week, "СЛОВО")
    return jsonify({"word": word})

@app.route('/update_word', methods=['POST'])
def update_word():
    data = request.json
    for key in data:
        if key in words:
            words[key] = data[key]
    file_content = json.dumps(words, ensure_ascii=False)
    try:
        update_github_file_content('words.json', file_content)
        return jsonify({"message": "Words updated successfully!"})
    except Exception as e:
        print(f"Failed to update words: {e}")
        return jsonify({"message": "Error updating words!"}), 500

@app.route('/get_word1', methods=['GET'])
def get_word1():
    day_of_week = request.args.get('day_of_week', datetime.datetime.now().strftime('%A').lower())
    word = words1.get(day_of_week, "СЛОВО")
    return jsonify({"word": word})

@app.route('/update_word1', methods=['POST'])
def update_word1():
    data = request.json
    for key in data:
        if key in words1:
            words1[key] = data[key]
    file_content = json.dumps(words1, ensure_ascii=False)
    try:
        update_github_file_content('words1.json', file_content)
        return jsonify({"message": "Words updated successfully!"})
    except Exception as e:
        print(f"Failed to update words1: {e}")
        return jsonify({"message": "Error updating words1!"}), 500

@app.route('/get_wordlist', methods=['GET'])
def get_wordlist():
    try:
        with open('wordlist.json', 'r', encoding='utf-8') as file:
            wordlist = json.load(file)
        return jsonify(wordlist)
    except Exception as e:
        print(f"Failed to fetch wordlist: {e}")
        return jsonify({"message": "Error fetching wordlist!"}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
