async function updateWords() {
    const statusDiv = document.getElementById('status');
    statusDiv.innerText = ''; // Clear previous status

    // Собираем данные формы
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
        // Отправляем запрос на сервер
        const response = await fetch('https://my-web-app-wordly.onrender.com/update_words', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(words)
        });

        if (response.ok) {
            statusDiv.innerText = 'Words updated successfully!';
        } else {
            statusDiv.innerText = 'Error updating words. Please try again.';
        }
    } catch (error) {
        console.error('Error:', error);
        statusDiv.innerText = 'Error updating words. Please try again.';
    }
}
