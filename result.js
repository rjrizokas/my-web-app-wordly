document.addEventListener('DOMContentLoaded', function () {
    const usernames = {
        "1719750087": "nft337",
        "253293158": "vio_goncharova",
        "5038756": "bormts",
        "96546832": "aantropov",
        "6249399528": "rizo337"
    };

    function fetchDataAndPopulate(url, tableId) {
        fetch(url)
            .then(response => response.json())
            .then(data => populateTable(data, tableId))
            .catch(error => console.error('Error fetching data:', error));
    }

    function populateTable(data, tableId) {
        const table = document.getElementById(tableId);
        table.innerHTML = '';  // Clear existing content

        for (const [date, users] of Object.entries(data)) {
            for (const [userId, attempts] of Object.entries(users)) {
                const row = table.insertRow();
                const cellUserId = row.insertCell();
                const nickname = usernames[userId] || userId;  // Replace userId with nickname if exists
                cellUserId.innerHTML = nickname;
                const cellAttempts = row.insertCell();
                const attemptContainer = document.createElement('div');

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

                cellAttempts.appendChild(attemptContainer);
            }
        }
    }

    fetchDataAndPopulate('daily_user_data_yesterday.json', 'daily_user_data');
    fetchDataAndPopulate('daily_user_data1_yesterday.json', 'daily_user_data1');
});
