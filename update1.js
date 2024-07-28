let wordList = [];
let initialWords1 = {};

async function fetchWordList() {
    try {
        const response = await fetch('https://my-web-app-wordly.onrender.com/get_wordlist');
        const data = await response.json();
        wordList = data.wordlist.map(word => word.toUpperCase());
        console.log('Wordlist loaded:', wordList);
    } catch (error) {
        console.error('Ошибка загрузки списка допустимых слов:', error);
        alert('Ошибка загрузки списка допустимых слов.');
    }
}

async function fetchInitialWords1() {
    try {
        const response = await fetch('https://my-web-app-wordly.onrender.com/get_initial_words1');
        const data = await response.json();
        if (data.words1) {
            initialWords1 = data.words1;
            console.log('Initial words1 loaded:', initialWords1);
            displayInitialWords1();
        } else {
            console.error('Ошибка загрузки начальных слов:', data.error);
            alert('Ошибка загрузки начальных слов.');
        }
    } catch (error) {
        console.error('Ошибка загрузки начальных слов:', error);
        alert('Ошибка загрузки начальных слов.');
    }
}

function displayInitialWords1() {
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    days.forEach((day, index) => {
        const input = document.getElementById(`word${index + 1}`);
        if (initialWords1[day]) {
            input.value = initialWords1[day];
            input.style.color = 'rgba(128, 128, 128, 0.5)';  // Полупрозрачный серый цвет
        }

        // Добавить обработчик событий для изменения цвета текста при вводе новых слов
        input.addEventListener('input', () => {
            if (input.value.toUpperCase() !== (initialWords1[day] || '').toUpperCase()) {
                input.style.color = 'black';
            } else {
                input.style.color = 'rgba(128, 128, 128, 0.5)';
            }
        });
    });
}
async function updateAllWords() {
    const words1 = {
        monday: document.getElementById('word1').value.toUpperCase(),
        tuesday: document.getElementById('word2').value.toUpperCase(),
        wednesday: document.getElementById('word3').value.toUpperCase(),
        thursday: document.getElementById('word4').value.toUpperCase(),
        friday: document.getElementById('word5').value.toUpperCase(),
        saturday: document.getElementById('word6').value.toUpperCase(),
        sunday: document.getElementById('word7').value.toUpperCase(),
        last_updated: new Date().toISOString().slice(0, 19).replace('T', ' ')
    };

    for (const day in words1) {
        if (words1[day] === "" && day !== 'last_updated') {
            delete words1[day];
        }
    }

    for (const word of Object.values(words1)) {
        if (!wordList.includes(word)) {
            alert(`Ошибка: слово '${word}' не входит в список допустимых слов.`);
            return;
        }
    }
    try {
        const response = await fetch('https://my-web-app-wordly.onrender.com/update_word1', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(words1)
        });

        if (response.ok) {
            alert('Слова успешно обновлены!');
            Telegram.WebApp.close(); // Закрыть Web App после успешного обновления слов
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
    fetchInitialWords1();
}
