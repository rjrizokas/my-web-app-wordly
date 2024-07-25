async function updateWords() {
    const statusDiv = document.getElementById('status');
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    let updatePromises = [];

    days.forEach(day => {
        const wordInput = document.getElementById(day);
        const word = wordInput.value.trim();
        if (word) {
            updatePromises.push(
                fetch('https://your-flask-app-url/update_word', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ day: day, word: word })
                }).then(response => response.json())
            );
        }
    });

    try {
        const results = await Promise.all(updatePromises);
        statusDiv.innerHTML = 'Words updated successfully!';
    } catch (error) {
        statusDiv.innerHTML = 'Error updating words.';
        console.error('Error:', error);
    }
}
