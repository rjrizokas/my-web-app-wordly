document.addEventListener('DOMContentLoaded', function () {
    const usernames = {
    "1719750087": "nft337",
    "253293158": "vio_goncharova",
    "5038756": "bormts",
    "96546832": "aantropov",
    "6249399528": "rizo337"
};
    fetch('daily_user_data_yesterday.json')
        .then(response => response.json())
        .then(data => populateTable(data, 'Слово от Романа'));

    fetch('daily_user_data1_yesterday.json')
        .then(response => response.json())
        .then(data => populateTable(data, 'Слово от Виорики'));
});



function populateTable(data, title) {
    const table = document.getElementById('results_table');
    const headerRow = table.insertRow();
    
    // Insert title row
    const titleCell = headerRow.insertCell();
    titleCell.colSpan = 2; // Cover two columns
    titleCell.innerHTML = `<strong>${title}</strong>`;
    titleCell.style.backgroundColor = '#f4f4f4';
    titleCell.style.fontWeight = 'bold';
    
    // Insert data rows
    for (const [date, users] of Object.entries(data)) {
        for (const [userId, attempts] of Object.entries(users)) {
            const username = usernames[userId] || userId; // Use nickname if available, otherwise default to userId

            const userRow = table.insertRow();
            const userIdCell = userRow.insertCell();
            userIdCell.colSpan = 2;
            userIdCell.innerHTML = username;
            userIdCell.style.backgroundColor = '#f9f9f9';
            
            const attemptsRow = table.insertRow();
            const attemptsCell = attemptsRow.insertCell();
            attemptsCell.colSpan = 2;
            const attemptContainer = document.createElement('div');

            // Create grid for attempts
            for (let i = 0; i < 6; i++) {
                for (let j = 0; j < 5; j++) {
                    const cell = document.createElement('div');
                    cell.className = 'cell';
                    cell.innerHTML = attempts[i] ? attempts[i][j] || '' : '';
                    attemptContainer.appendChild(cell);
                }
                const lineBreak = document.createElement('br');
                attemptContainer.appendChild(lineBreak);
            }

            attemptsCell.appendChild(attemptContainer);
        }
    }
}
