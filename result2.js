document.addEventListener('DOMContentLoaded', function () {
    const usernames = {
        "1719750087": "tester2",
        "253293158": "VI",
        "5038756": "Nikita",
        "96546832": "Antropov",
        "6249399528": "tester"
        "86286733": "Artem"
        "124848225": "Romankosw"
        "250997161": "Irina"
        "103939024": "RJ"
    };

    function fetchDataAndPopulate(url, sectionId, title) {
        fetch(url)
            .then(response => response.json())
            .then(data => populateSection(data, sectionId, title))
            .catch(error => console.error('Error fetching data:', error));
    }

    function populateSection(data, sectionId, title) {
        const section = document.getElementById(sectionId);
        section.innerHTML = '';  // Clear existing content

        const titleElement = document.createElement('h2');
        titleElement.innerHTML = title;
        section.appendChild(titleElement);

        for (const [date, users] of Object.entries(data)) {
            for (const [userId, attempts] of Object.entries(users)) {
                // Create and append nickname
                const nickname = usernames[userId] || userId;  // Replace userId with nickname if exists
                const nicknameElement = document.createElement('p');
                nicknameElement.className = 'nickname';
                nicknameElement.innerHTML = nickname;
                section.appendChild(nicknameElement);

                // Create and append attempts
                const attemptContainer = document.createElement('div');
                attemptContainer.className = 'attempts-container';

                for (let i = 0; i < 6; i++) {
                    const row = document.createElement('div');
                    row.className = 'attempt-row';

                    for (let j = 0; j < 5; j++) {
                        const cell = document.createElement('div');
                        cell.className = 'cell';
                        cell.innerHTML = attempts[i] ? attempts[i][j] || '' : '';
                        row.appendChild(cell);
                    }

                    attemptContainer.appendChild(row);
                }

                section.appendChild(attemptContainer);
            }
        }
    }

    fetchDataAndPopulate('daily_user_data_yesterday.json', 'daily_user_data_section', 'Слово от Романа');
    fetchDataAndPopulate('daily_user_data1_yesterday.json', 'daily_user_data1_section', 'Слово от Виорики');
});
