import os
import json
import base64
import requests
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
WORDS_FILE_PATH = 'words.json'
WORDLIST_FILE_PATH = 'wordlist.json'

def get_github_file_content(file_path):
    url = f'https://api.github.com/repos/{REPO_OWNER}/{REPO_NAME}/contents/{file_path}'
    headers = {
        'Authorization': f'token {GITHUB_TOKEN}',
        'Accept': 'application/vnd.github.v3+json'
    }
    response = requests.get(url, headers=headers)
    print(f"GET request to {url} returned status code {response.status_code}")
    if response.status_code == 200:
        content = response.json()
        file_content = base64.b64decode(content['content']).decode()
        return json.loads(file_content)
    else:
        print("Error fetching file:", response.status_code, response.json())
        response.raise_for_status()

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
        print("Error fetching file SHA:", response.status_code, response.json())
        response.raise_for_status()

    data = {
        'message': f'Update {file_path}',
        'content': file_content_base64,
        'sha': sha,  # SHA текущей версии файла
        'branch': 'main'
    }
    response = requests.put(url, headers=headers, json=data)
    print(f"PUT request to {url} returned status code {response.status_code}")
    if response.status_code == 200:
        return response.json()
    else:
        print("Error updating file:", response.status_code, response.json())
        response.raise_for_status()

def load_local_wordlist():
    try:
        with open(WORDLIST_FILE_PATH, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"Failed to load wordlist from {WORDLIST_FILE_PATH}: {e}")
        return []

try:
    words = get_github_file_content(WORDS_FILE_PATH)
    wordlist = load_local_wordlist()
except Exception as e:
    print(f"Failed to fetch words or wordlist: {e}")
    words = {}
    wordlist = []

@app.route('/get_word', methods=['GET'])
def get_word():
    day_of_week = request.args.get('day_of_week', datetime.datetime.now().strftime('%A').lower())
    word = words.get(day_of_week, "СЛОВО")
    return jsonify({"word": word})

@app.route('/get_wordlist', methods=['GET'])
def get_wordlist():
    return jsonify({"wordlist": wordlist})

@app.route('/update_word', methods=['POST'])
def update_word():
    data = request.json
    print("Received data for update:", data)
    
    for key, value in data.items():
        if key in words:
            if value in wordlist:
                words[key] = value
            else:
                print(f"Word '{value}' is not in the allowed word list.")
                return jsonify({"message": f"Error: word '{value}' is not in the allowed word list."}), 400

    file_content = json.dumps(words, ensure_ascii=False)
    try:
        update_github_file_content(WORDS_FILE_PATH, file_content)
        return jsonify({"message": "Words updated successfully!"})
    except Exception as e:
        print(f"Failed to update words: {e}")
        return jsonify({"message": "Error updating words!"}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
