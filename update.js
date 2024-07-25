async function updateAllWords() {
    const words = {
        word1: document.getElementById('word1').value,
        word2: document.getElementById('word2').value,
        word3: document.getElementById('word3').value,
        word4: document.getElementById('word4').value,
        word5: document.getElementById('word5').value,
        word6: document.getElementById('word6').value,
        word7: document.getElementById('word7').value
    };

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
}
