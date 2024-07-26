let wordList = [];

async function fetchWordList() {
    try {
        const response = await fetch('https://my-web-app-wordly.onrender.com/get_wordlist');
        const data = await response.json();
        wordList = data.wordlist.map(word => word.toUpperCase()); // Преобразование слов в верхний регистр для соответствия вводу
        console.log('Wordlist loaded:', wordList);
    } catch (error) {
        console.error('Ошибка загрузки списка допустимых слов:', error);
        alert('Ошибка загрузки списка допустимых слов.');
    }
}

async function updateAllWords() {
    const words = {
        monday: document.getElementById('word1').value.toUpperCase(),
        tuesday: document.getElementById('word2').value.toUpperCase(),
        wednesday: document.getElementById('word3').value.toUpperCase(),
        thursday: document.getElementById('word4').value.toUpperCase(),
        friday: document.getElementById('word5').value.toUpperCase(),
        saturday: document.getElementById('word6').value.toUpperCase(),
        sunday: document.getElementById('word7').value.toUpperCase()
    };

    for (const day in words) {
        if (words[day] === "") {
            delete words[day];
        }
    }

    for (const word of Object.values(words)) {
        if (!wordList.includes(word)) {
            alert(`Ошибка: слово '${word}' не входит в список допустимых слов.`);
            return;
        }
    }

    try {
        const response = await fetch('https://my-web-app-wordly.onrender.com/update_word', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(words)
        });

        if (response.ok) {
            alert('Слова успешно обновлены!');
        } else {
            alert('Ошибка обновления слов.');
        }
    } catch (error) {
        console.error('Ошибка:', error);
        alert('Ошибка при отправке запроса.');
    }
}

window.onload = function() {
    fetchWordList();
}
