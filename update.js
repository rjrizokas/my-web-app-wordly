document.getElementById('updateButton').addEventListener('click', updateWords);

async function updateWords() {
    const words = {
        monday: document.getElementById('word1').value.toUpperCase(),
        tuesday: document.getElementById('word2').value.toUpperCase(),
        wednesday: document.getElementById('word3').value.toUpperCase(),
        thursday: document.getElementById('word4').value.toUpperCase(),
        friday: document.getElementById('word5').value.toUpperCase(),
        saturday: document.getElementById('word6').value.toUpperCase(),
        sunday: document.getElementById('word7').value.toUpperCase()
    };

    try {
        const response = await fetch('https://your-domain.com/update_words', {
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
