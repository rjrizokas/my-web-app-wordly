let height = 6; // number of guesses
let width = 5; // length of the word

let row = 0; // current guess (attempt #)
let col = 0; // current letter for that attempt

let gameOver = false;
let word = ''; // The word to guess, initialized as empty
let wordList = ["агава", "аллах"]
let guessList = ["ааааа"];

guessList = guessList.concat(wordList);

window.onload = function() {
    console.log("Page loaded, initializing game...");
    initialize();
    fetchWordList().then(() => {
        fetchWord(); // Fetch the word from the server after word list is loaded
    });
    loadProgress(); // Load user progress on page load

    // Add event listener for the Update Word button
    document.getElementById('updateWord').addEventListener('click', () => {
        fetchWord(); // Fetch the word again when the button is clicked
    });
}

async function fetchWord() {
    try {
        console.log("Fetching word from server...");
        const response = await fetch('https://my-web-app-wordly.onrender.com/get_word');
        const data = await response.json();
        word = data.word.toUpperCase();
        console.log("Current word: ", word);
    } catch (error) {
        console.error('Error fetching word:', error);
    }
}

async function fetchWordList() {
    try {
        console.log("Fetching word list from server...");
        const response = await fetch('https://my-web-app-wordly.onrender.com/get_wordlist');
        const data = await response.json();
        wordList = data.wordlist.map(word => word.toUpperCase()); // Ensure all words are uppercase
        guessList = guessList.concat(wordList);
        console.log("Word list:", wordList);
    } catch (error) {
        console.error('Error fetching word list:', error);
        alert('Error fetching word list.');
    }
}

function intialize() {
    // Create the game board
    for (let r = 0; r < height; r++) {
        for (let c = 0; c < width; c++) {
            let tile = document.createElement("span");
            tile.id = r.toString() + "-" + c.toString();
            tile.classList.add("tile");
            tile.innerText = "";
            document.getElementById("board").appendChild(tile);
        }
    }

    // Create the keyboard
    let keyboard = [
        ["Й", "Ц", "У", "К", "Е", "Н", "Г", "Ш", "Щ", "З", "Х", "Ъ"],
        ["Ф", "Ы", "В", "А", "П", "Р", "О", "Л", "Д", "Ж", "Э", " "],
        ["Enter", "Я", "Ч", "С", "М", "И", "Т", "Ь", "Б", "Ю", "⌫"]
    ];

    for (let i = 0; i < keyboard.length; i++) {
        let currRow = keyboard[i];
        let keyboardRow = document.createElement("div");
        keyboardRow.classList.add("keyboard-row");

        for (let j = 0; j < currRow.length; j++) {
            let keyTile = document.createElement("div");

            let key = currRow[j];
            keyTile.innerText = key;
            if (key == "Enter") {
                keyTile.id = "Enter";
            } else if (key == "⌫") {
                keyTile.id = "Backspace";
            } else {
                keyTile.id = "Key" + key;
            }

            keyTile.addEventListener("click", processKey);

            if (key == "Enter") {
                keyTile.classList.add("enter-key-tile");
            } else if (key == "⌫") {
                keyTile.classList.add("backspace-key-tile");
            } else {
                keyTile.classList.add("key-tile");
            }
            keyboardRow.appendChild(keyTile);
        }
        document.body.appendChild(keyboardRow);
    }

    // Listen for Key Press
    document.addEventListener("keydown", (e) => {
        processInput(e);
    });
}

const keyMapping = {
    'KeyQ': 'Й', 'KeyW': 'Ц', 'KeyE': 'У', 'KeyR': 'К', 'KeyT': 'Е', 'KeyY': 'Н', 'KeyU': 'Г', 'KeyI': 'Ш', 'KeyO': 'Щ', 'KeyP': 'З', 'Key[': 'Х', 'Key]': 'Ъ',
    'KeyA': 'Ф', 'KeyS': 'Ы', 'KeyD': 'В', 'KeyF': 'А', 'KeyG': 'П', 'KeyH': 'Р', 'KeyJ': 'О', 'KeyK': 'Л', 'KeyL': 'Д', 'Key;': 'Ж', 'Key"': 'Э',
    'KeyZ': 'Я', 'KeyX': 'Ч', 'KeyC': 'С', 'KeyV': 'М', 'KeyB': 'И', 'KeyN': 'Т', 'KeyM': 'Ь', 'KeyБ': 'Б', 'Key>': 'Ю',
    'Backspace': 'Backspace'
};

function getLetterFromKeyCode(keyCode) {
    // Проверяем, есть ли символ в keyMapping
    if (keyMapping[keyCode]) {
        return keyMapping[keyCode];
    }
    // Если нет, возвращаем символ, извлеченный из keyCode
    else if (keyCode.startsWith("Key")) {
        return keyCode.slice(3);
    }
    return "";
}


function processKey() {
    let key = this.id;
    if (key === "Enter" || key === "Backspace") {
        let event = { "code": key };
        processInput(event);
    } else {
        let letter = this.innerText;
        let event = { "code": "Key" + letter };
        processInput(event);
    }
}




function processInput(e) {
    console.log(`Processing input: ${e.code}`);

    if (gameOver) return;

    let keyCode = e.code;
    let letter = getLetterFromKeyCode(keyCode); // Используем универсальную функцию

    if (keyCode === "Backspace") {
        if (col > 0) {
            col -= 1;
            let currTile = document.getElementById(row.toString() + '-' + col.toString());
            currTile.innerText = "";
        }
        return;
    } else if (keyCode === "Enter") {
        update();
        return;
    }

    // Обработка ввода буквы
    if (letter && col < width) {
        let currTile = document.getElementById(row.toString() + '-' + col.toString());
        if (currTile.innerText === "") {
            currTile.innerText = letter;
            col += 1;
        }
    }

    if (!gameOver && row === height) {
        gameOver = true;
        document.getElementById("answer").innerText = word;
    }
}





function update() {
    let guess = "";
    document.getElementById("answer").innerText = "";

    // Collect the guess from the board
    for (let c = 0; c < width; c++) {
        let currTile = document.getElementById(row.toString() + '-' + c.toString());
        let letter = currTile.innerText;
        guess += letter;
    }

    guess = guess.toLowerCase();
    console.log(guess);

    if (!guessList.includes(guess)) {
        document.getElementById("answer").innerText = "Not in word list";
        return;
    }

    let correct = 0;

    let letterCount = {};
    for (let i = 0; i < word.length; i++) {
        let letter = word[i];
        if (letterCount[letter]) {
            letterCount[letter] += 1;
        } else {
            letterCount[letter] = 1;
        }
    }

    console.log(letterCount);

    for (let c = 0; c < width; c++) {
        let currTile = document.getElementById(row.toString() + '-' + c.toString());
        let letter = currTile.innerText;

        if (word[c] === letter) {
            currTile.classList.add("correct");
            let keyTile = document.getElementById("Key" + letter);
            if (keyTile) {
                keyTile.classList.remove("present");
                keyTile.classList.add("correct");
            }
            correct += 1;
            letterCount[letter] -= 1;
        }

        if (correct === width) {
            gameOver = true;
        }
    }

    console.log(letterCount);
    for (let c = 0; c < width; c++) {
        let currTile = document.getElementById(row.toString() + '-' + c.toString());
        let letter = currTile.innerText;

        if (!currTile.classList.contains("correct")) {
            if (word.includes(letter) && letterCount[letter] > 0) {
                currTile.classList.add("present");
                let keyTile = document.getElementById("Key" + letter);
                if (keyTile && !keyTile.classList.contains("correct")) {
                    keyTile.classList.add("present");
                }
                letterCount[letter] -= 1;
            } else {
                currTile.classList.add("absent");
                let keyTile = document.getElementById("Key" + letter);
                if (keyTile) {
                    keyTile.classList.add("absent");
                }
            }
        }
    }

    row += 1;
    col = 0;
 saveProgress(); // Save progress after each attempt
}

async function saveProgress() {
    try {
        console.log("Saving progress...");
        const userId = document.getElementById('user_id').value;
        const progress = {
            row: row,
            col: col,
            word: word,
            guess: Array.from({length: height}, (_, r) => Array.from({length: width}, (_, c) => document.getElementById(r.toString() + '-' + c.toString()).innerText))
        };
        const response = await fetch('https://my-web-app-wordly.onrender.com/save_progress', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ user_id: userId, progress: progress })
        });
        if (!response.ok) {
            throw new Error('Failed to save progress');
        }
        console.log("Progress saved successfully.");
    } catch (error) {
        console.error('Error saving progress:', error);
    }
}

async function loadProgress() {
    try {
        console.log("Loading progress...");
        const userId = document.getElementById('user_id').value;
        const response = await fetch(`https://my-web-app-wordly.onrender.com/get_progress?user_id=${userId}`);
        const data = await response.json();
        console.log("Loaded progress:", data);
        if (data.progress) {
            row = data.progress.row;
            col = data.progress.col;
            const savedGuesses = data.progress.guess;
            savedGuesses.forEach((rowGuesses, r) => {
                rowGuesses.forEach((letter, c) => {
                    let tile = document.getElementById(r.toString() + '-' + c.toString());
                    if (tile) {
                        tile.innerText = letter;
                        if (letter === '') return;
                        // Apply styles based on the letter's status
                        // This requires a more sophisticated approach based on your game logic
                    }
                });
            });
        }
    } catch (error) {
        console.error('Error loading progress:', error);
    }
}

