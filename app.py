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
WORDS_FILE_PATH = 'words.json'
WORDS1_FILE_PATH = 'words1.json'
WORDLIST_FILE_PATH = 'wordlist.json'
DAILY_USER_DATA_FILE_PATH = 'daily_user_data.json'
DAILY_USER_DATA1_FILE_PATH = 'daily_user_data1.json'

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

try:
    words = get_github_file_content(WORDS_FILE_PATH)
    wordlist = get_github_file_content(WORDLIST_FILE_PATH)
except Exception as e:
    print(f"Failed to fetch words or wordlist: {e}")
    words = {}
    wordlist = []

try:
    words1 = get_github_file_content(WORDS1_FILE_PATH)
except Exception as e:
    print(f"Failed to fetch words or wordlist: {e}")
    words1 = {}

def get_daily_user_data(file_path):
    try:
        return get_github_file_content(file_path)
    except Exception as e:
        print(f"Failed to fetch daily user data: {e}")
        return {}

def update_daily_user_data(file_path, data):
    try:
        file_content = json.dumps(data, ensure_ascii=False)
        update_github_file_content(file_path, file_content)
    except Exception as e:
        print(f"Failed to update daily user data: {e}")

@app.route('/get_word', methods=['GET'])
def get_word():
    day_of_week = request.args.get('day_of_week', datetime.datetime.now().strftime('%A').lower())
    word = words.get(day_of_week, "СЛОВО")
    return jsonify({"word": word})

@app.route('/get_word1', methods=['GET'])
def get_word1():
    day_of_week = request.args.get('day_of_week', datetime.datetime.now().strftime('%A').lower())
    word = words1.get(day_of_week, "СЛОВО")
    return jsonify({"word": word})

@app.route('/get_wordlist', methods=['GET'])
def get_wordlist():
    return jsonify({"wordlist": wordlist})

@app.route('/update_word', methods=['POST'])
def update_word():
    data = request.json
    for key in data:
        if key in words:
            words[key] = data[key]
    file_content = json.dumps(words, ensure_ascii=False)
    try:
        update_github_file_content(WORDS_FILE_PATH, file_content)
        return jsonify({"message": "Words updated successfully!"})
    except Exception as e:
        print(f"Failed to update words: {e}")
        return jsonify({"message": "Error updating words!"}), 500

@app.route('/update_word1', methods=['POST'])
def update_word1():
    data = request.json
    for key in data:
        if key in words1:
            words1[key] = data[key]
    file_content = json.dumps(words1, ensure_ascii=False)
    try:
        update_github_file_content(WORDS1_FILE_PATH, file_content)
        return jsonify({"message": "Words updated successfully!"})
    except Exception as e:
        print(f"Failed to update words: {e}")
        return jsonify({"message": "Error updating words!"}), 500

@app.route('/get_daily_user_data', methods=['GET'])
def get_daily_user_data_route():
    user_id = request.args.get('user_id')
    file_path = request.args.get('file', DAILY_USER_DATA_FILE_PATH)
    if not user_id:
        return jsonify({"error": "User ID is required"}), 400
    data = get_daily_user_data(file_path).get(user_id, {})
    return jsonify(data)

@app.route('/reset_daily_user_data', methods=['POST'])
def reset_daily_user_data_route():
    user_id = request.json.get('user_id')
    file_path = request.json.get('file', DAILY_USER_DATA_FILE_PATH)
    if not user_id:
        return jsonify({"error": "User ID is required"}), 400

    today = datetime.datetime.now().strftime('%Y-%m-%d')
    user_data = get_daily_user_data(file_path)
    user_data[user_id] = {
        "guessList": [],
        "currentRow": 0,
        "currentCol": 0,
        "last_reset_date": today
    }

    update_daily_user_data(file_path, user_data)
    return jsonify({"message": "User data reset successfully!"})

@app.route('/update_daily_user_data', methods=['POST'])
def update_daily_user_data_route():
    user_id = request.json.get('user_id')
    file_path = request.json.get('file', DAILY_USER_DATA_FILE_PATH)
    if not user_id:
        return jsonify({"error": "User ID is required"}), 400

    data = request.json.get('data', {})
    user_data = get_daily_user_data(file_path)
    if user_id not in user_data:
        user_data[user_id] = {}
    user_data[user_id].update(data)
    update_daily_user_data(file_path, user_data)
    return jsonify({"message": "User data updated successfully!"})

@app.route('/save_progress', methods=['POST'])
def save_progress():
    try:
        data = request.get_json()
        user_id = data['user_id']
        progress = data['progress']
        date = datetime.datetime.now().strftime("%Y-%m-%d")

        daily_user_data = get_daily_user_data(DAILY_USER_DATA_FILE_PATH)

        if date not in daily_user_data:
            daily_user_data[date] = {}
        daily_user_data[date][user_id] = progress

        update_daily_user_data(DAILY_USER_DATA_FILE_PATH, daily_user_data)

        return jsonify({"message": "Progress saved successfully."}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/get_progress', methods=['GET'])
def get_progress():
    try:
        user_id = request.args.get('user_id')
        date = datetime.datetime.now().strftime("%Y-%m-%d")

        daily_user_data = get_daily_user_data(DAILY_USER_DATA_FILE_PATH)

        if date in daily_user_data and user_id in daily_user_data[date]:
            progress = daily_user_data[date][user_id]
        else:
            progress = []

        return jsonify({"progress": progress}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.getenv('PORT', 5000)))  # Запускаем на порту 5000
