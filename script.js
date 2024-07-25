// Изначальное значение переменной
var word = "WHALE";

// Функция для обновления значения переменной и отображения на странице
function updateWord(newWord) {
    word = newWord;
    document.getElementById('currentValue').textContent = word;
}

// Обработка отправки формы
document.getElementById('updateForm').addEventListener('submit', function(event) {
    event.preventDefault();  // Предотвращаем перезагрузку страницы
    var newWord = document.getElementById('newWord').value;
    updateWord(newWord);  // Обновляем значение переменной
    document.getElementById('newWord').value = '';  // Очищаем поле ввода
});
