from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import base64
import json

app = Flask(__name__)
CORS(app)

# GitHub repository details
GITHUB_API_URL = "https://api.github.com"
REPO_OWNER = "rjrizokas"
REPO_NAME = "my-web-app-wordly"
FILE_PATH = "words.json"
BRANCH_NAME = "main"
GITHUB_TOKEN = "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"

def get_github_file_contents():
    url = f"{GITHUB_API_URL}/repos/{REPO_OWNER}/{REPO_NAME}/contents/{FILE_PATH}?ref={BRANCH_NAME}"
    headers = {
        "Authorization": f"token {GITHUB_TOKEN}",
        "Accept": "application/vnd.github.v3.raw"
    }
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        content = response.json()
        file_content = base64.b64decode(content['content']).decode('utf-8')
        return json.loads(file_content)
    else:
        return {}

def update_github_file(contents):
    url = f"{GITHUB_API_URL}/repos/{REPO_OWNER}/{REPO_NAME}/contents/{FILE_PATH}"
    headers = {
        "Authorization": f"token {GITHUB_TOKEN}",
        "Accept": "application/vnd.github.v3+json"
    }
    # Get the SHA of the existing file
    file_info = requests.get(url, headers=headers).json()
    sha = file_info['sha']
    encoded_content = base64.b64encode(json.dumps(contents, ensure_ascii=False).encode('utf-8')).decode('utf-8')
    data = {
        "message": "Update words.json via API",
        "content": encoded_content,
        "sha": sha,
        "branch": BRANCH_NAME
    }
    response = requests.put(url, headers=headers, json=data)
    return response.status_code == 200

@app.route('/get_word', methods=['GET'])
def get_word():
    day_of_week = request.args.get('day_of_week', 'monday').lower()
    words = get_github_file_contents()
    word = words.get(day_of_week, "СЛОВО")  # Default value if day not found
    return jsonify({"word": word})

@app.route('/update_word', methods=['POST'])
def update_word():
    data = request.json
    words = get_github_file_contents()
    for key in data:
        if key in words:
            words[key] = data[key]
    success = update_github_file(words)
    if success:
        return jsonify({"message": "Words updated successfully!"})
    else:
        return jsonify({"message": "Failed to update words."}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
