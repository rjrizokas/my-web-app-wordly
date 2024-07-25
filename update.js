async function updateWords() {
    const member = document.title.split(' ')[2].toLowerCase();
    const words = {
        monday: document.getElementById('monday').value,
        tuesday: document.getElementById('tuesday').value,
        wednesday: document.getElementById('wednesday').value,
        thursday: document.getElementById('thursday').value,
        friday: document.getElementById('friday').value,
        saturday: document.getElementById('saturday').value,
        sunday: document.getElementById('sunday').value
    };

    try {
        const response = await fetch('https://your-domain.com/update_word', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ [member]: words })
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
