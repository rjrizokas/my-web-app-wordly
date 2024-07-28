document.getElementById('add-word-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const newWord = document.getElementById('new-word').value.toUpperCase();
    const messageDiv = document.getElementById('message');

    if (newWord.length !== 5) {
        messageDiv.textContent = 'Ошибка: слово должно состоять из 5 букв.';
        return;
    }

    try {
        const response = await fetch('https://my-web-app-wordly.onrender.com/add_word', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ word: newWord })
        });

        if (response.ok) {
            messageDiv.textContent = 'Слово успешно добавлено!';
            messageDiv.style.color = 'green';
                        Telegram.WebApp.close(); // Закрыть Web App после успешного обновления слов

        } else {
            const errorData = await response.json();
            messageDiv.textContent = `Ошибка: ${errorData.message}`;
        }
    } catch (error) {
        console.error('Ошибка:', error);
        messageDiv.textContent = 'Ошибка при добавлении слова.';
    }
});
