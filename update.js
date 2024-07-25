async function updateAllWords() {
    const words = {
        monday: document.getElementById('word1').value,
        tuesday: document.getElementById('word2').value,
        wednesday: document.getElementById('word3').value,
        thursday: document.getElementById('word4').value,
        friday: document.getElementById('word5').value,
        saturday: document.getElementById('word6').value,
        sunday: document.getElementById('word7').value
    };

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
