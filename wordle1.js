let height = 6; // number of guesses
let width = 5; // length of the word

let row = 0; // current guess (attempt #)
let col = 0; // current letter for that attempt

let gameOver = false;
let word = ''; // The word to guess, initialized as empty
let wordList = [];

window.onload = function() {
    intialize();
    fetchWordList().then(() => {
        return fetchWord();
    }).then(() => {
        return loadProgress(); // Load user progress after word and word list are loaded
    }).catch(error => {
        console.error('Error during initialization:', error);
    });

    // Add event listener for the Update Word button
    const updateWordButton = document.getElementById('updateWord');
    if (updateWordButton) {
        updateWordButton.addEventListener('click', () => {
            fetchWord(); // Fetch the word again when the button is clicked
        });
    }
}


async function fetchWord() {
    try {
        console.log("Fetching word from server...");
        const response = await fetch('https://my-web-app-wordly.onrender.com/get_word1');
        const data = await response.json();
        word = data.word.toUpperCase();
        console.log("Current word: ", word);
    } catch (error) {
        console.error('Error fetching word:', error);
    }
}

async function fetchWordList() {
    try {
        const response = await fetch('https://my-web-app-wordly.onrender.com/get_wordlist');
        const data = await response.json();
        wordList = data.wordlist.map(word => word.toLowerCase()); // Приведение слов к нижнему регистру
        console.log('Wordlist loaded:', wordList);
    } catch (error) {
        console.error('Ошибка загрузки списка допустимых слов:', error);
        alert('Ошибка загрузки списка допустимых слов.');
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

    for (let c = 0; c < width; c++) {
        let currTile = document.getElementById(row.toString() + '-' + c.toString());
        let letter = currTile.innerText;
        guess += letter;
    }

    guess = guess.toLowerCase(); // Приведение слова к нижнему регистру для проверки
    console.log(guess);

    if (!wordList.includes(guess)) {
        alert(`Ошибка: слово '${guess}' не входит в список допустимых слов.`);
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
    const user_id = new URLSearchParams(window.location.search).get('user_id');
    
    if (!user_id) {
        console.error("User ID not found in URL");
        return;
    }

    const progress = [];
    
    for (let r = 0; r < row; r++) {
        let guess = "";
        for (let c = 0; c < width; c++) {
            let currTile = document.getElementById(r.toString() + '-' + c.toString());
            guess += currTile.innerText;
        }
        progress.push(guess);
    }

    const data = {
        user_id: user_id,
        progress: progress
    };

    try {
        const response = await fetch('https://my-web-app-wordly.onrender.com/save_progress1', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        console.log(result.message);
    } catch (error) {
        console.error('Error saving progress:', error);
    }
}


async function loadProgress() {
    const user_id = new URLSearchParams(window.location.search).get('user_id');
    
    if (!user_id) {
        console.error("User ID not found in URL");
        return;
    }

    try {
        const response = await fetch(`https://my-web-app-wordly.onrender.com/get_progress1?user_id=${user_id}`);
        const data = await response.json();
        const progress = data.progress;

        if (progress && progress.length > 0) {
            row = progress.length;
            for (let r = 0; r < progress.length; r++) {
                let guess = progress[r];

                // Заполняем плитки
                for (let c = 0; c < width; c++) {
                    let currTile = document.getElementById(r.toString() + '-' + c.toString());
                    currTile.innerText = guess[c];
                }

                // Проверяем и окрашиваем плитки
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

                for (let c = 0; c < width; c++) {
                    let currTile = document.getElementById(r.toString() + '-' + c.toString());
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

                for (let c = 0; c < width; c++) {
                    let currTile = document.getElementById(r.toString() + '-' + c.toString());
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
            }

            // Устанавливаем текущий столбец на начало следующего ряда
            col = 0;
        }
    } catch (error) {
        console.error('Error loading progress:', error);
    }
}


