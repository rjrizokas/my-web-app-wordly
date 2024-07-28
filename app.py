import os
import requests
import base64
import json
from flask import Flask, request, jsonify
from flask_cors import CORS
import datetime
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger
import pytz

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
    
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        sha = response.json().get('sha')
    else:
        print("Error fetching file SHA:", response.status_code, response.json())
        response.raise_for_status()

    data = {
        'message': f'Update {file_path}',
        'content': file_content_base64,
        'sha': sha,
        'branch': 'main'
    }
    response = requests.put(url, headers=headers, json=data)
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


def copy_file_content(source_path, destination_path):
    try:
        content = get_github_file_content(source_path)
        update_github_file_content(destination_path, json.dumps(content, ensure_ascii=False))
        print(f"Copied content from {source_path} to {destination_path} successfully!")
    except Exception as e:
        print(f"Failed to copy content from {source_path} to {destination_path}: {e}")

def clear_file(file_path):
    try:
        update_github_file_content(file_path, json.dumps({}, ensure_ascii=False))
        print(f"Cleared content of {file_path} successfully!")
    except Exception as e:
        print(f"Failed to clear content of {file_path}: {e}")

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

def reset_daily_data():
    try:
        copy_file_content(DAILY_USER_DATA_FILE_PATH, 'daily_user_data_yesterday.json')
        copy_file_content(DAILY_USER_DATA1_FILE_PATH, 'daily_user_data1_yesterday.json')
        clear_file(DAILY_USER_DATA_FILE_PATH)
        clear_file(DAILY_USER_DATA1_FILE_PATH)
        print("Daily user data reset successfully!")
    except Exception as e:
        print(f"Failed to reset daily user data: {e}")

@app.route('/get_word', methods=['GET'])
def get_word():
    try:
        with open(WORDS_FILE_PATH, 'r', encoding='utf-8') as file:
            words = json.load(file)
        today = datetime.datetime.now().strftime('%A').lower()
        word_of_the_day = words.get(today, "")
        last_updated = words.get("last_updated", "")
        return jsonify({"word": word_of_the_day, "last_updated": last_updated})
    except Exception as e:
        print(f"Failed to get word: {e}")
        return jsonify({"message": "Error fetching word!"}), 500
        
@app.route('/get_word1', methods=['GET'])
def get_word1():
    try:
        with open(WORDS1_FILE_PATH, 'r', encoding='utf-8') as file:
            words1 = json.load(file)
        today = datetime.datetime.now().strftime('%A').lower()
        word_of_the_day = words1.get(today, "")
        last_updated = words1.get("last_updated", "")
        return jsonify({"word": word_of_the_day, "last_updated": last_updated})
    except Exception as e:
        print(f"Failed to get word: {e}")
        return jsonify({"message": "Error fetching word!"}), 500

@app.route('/get_wordlist', methods=['GET'])
def get_wordlist():
    return jsonify({"wordlist": wordlist})

@app.route('/update_word', methods=['POST'])
def update_word():
    data = request.json
    for key in data:
        if key in words:
            words[key] = data[key]
    
    words["last_updated"] = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')

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

    words1["last_updated"] = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')

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

@app.route('/save_progress1', methods=['POST'])
def save_progress1():
    try:
        data = request.get_json()
        user_id = data['user_id']
        progress = data['progress']
        date = datetime.datetime.now().strftime("%Y-%m-%d")

        daily_user_data = get_daily_user_data(DAILY_USER_DATA1_FILE_PATH)

        if date not in daily_user_data:
            daily_user_data[date] = {}
        daily_user_data[date][user_id] = progress

        update_daily_user_data(DAILY_USER_DATA1_FILE_PATH, daily_user_data)

        return jsonify({"message": "Progress saved successfully."}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/get_progress1', methods=['GET'])
def get_progress1():
    try:
        user_id = request.args.get('user_id')
        date = datetime.datetime.now().strftime("%Y-%m-%d")

        daily_user_data = get_daily_user_data(DAILY_USER_DATA1_FILE_PATH)

        if date in daily_user_data and user_id in daily_user_data[date]:
            progress = daily_user_data[date][user_id]
        else:
            progress = []

        return jsonify({"progress": progress}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/get_initial_words", methods=["GET"])
def get_initial_words():
    try:
        words = get_github_file_content(WORDS_FILE_PATH)
        return {"words": words}
    except Exception as e:
        return {"error": str(e)}

@app.route("/get_initial_words1", methods=["GET"])
def get_initial_words1():
    try:
        words1 = get_github_file_content(WORDS1_FILE_PATH)
        return {"words1": words1}
    except Exception as e:
        return {"error": str(e)}

@app.route('/add_word', methods=['POST'])
def add_word():
    data = request.json
    new_word = data.get('word', '').upper()

    if len(new_word) != 5:
        return jsonify({"message": "Слово должно состоять из 5 букв."}), 400

    if new_word in wordlist:
        return jsonify({"message": "Слово уже есть в списке."}), 400

    wordlist.append(new_word)
    file_content = json.dumps(wordlist, ensure_ascii=False)

    try:
        update_github_file_content(WORDLIST_FILE_PATH, file_content)
        return jsonify({"message": "Слово успешно добавлено!"})
    except Exception as e:
        print(f"Failed to update wordlist: {e}")
        return jsonify({"message": "Ошибка при добавлении слова."}), 500

timezone = pytz.timezone('Europe/Berlin')
scheduler = BackgroundScheduler()
scheduler.add_job(reset_daily_data, CronTrigger(hour=0, minute=0, timezone=timezone))
scheduler.start()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.getenv('PORT', 5000)))
