document.getElementById('updateForm').addEventListener('submit', async (event) => {
    event.preventDefault(); // Предотвращаем стандартное действие формы

    const wordInput = document.getElementById('wordInput').value;
    
    try {
        const response = await fetch('http://localhost:5000/update_word', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ word: wordInput }),
        });

        if (response.ok) {
            document.getElementById('responseMessage').innerText = 'Word updated successfully!';
        } else {
            document.getElementById('responseMessage').innerText = 'Failed to update word.';
        }
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('responseMessage').innerText = 'Error updating word.';
    }
});
