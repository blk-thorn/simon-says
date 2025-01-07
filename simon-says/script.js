const startButton = document.getElementById('start');
const virtualKeyboard = document.getElementById('virtual-keyboard');


const difficulty = {
  easy: '0123456789',
  medium: 'QWERTYUIOPASDFGHJKLZXCVBNM',
  hard: '0123456789QWERTYUIOPASDFGHJKLZXCVBNM'
};

let sequence = [];
let currentRound = 0;
let currentDifficulty = 'easy';

// Уровни сложности
document.getElementById('easy').addEventListener('click', () => {
  currentDifficulty = 'easy';
  generateVirtualKeyboard();
});
document.getElementById('medium').addEventListener('click', () => {
  currentDifficulty = 'medium';
  generateVirtualKeyboard();
});
document.getElementById('hard').addEventListener('click', () => {
  currentDifficulty = 'hard';
  generateVirtualKeyboard();
});

function generateVirtualKeyboard() {
  virtualKeyboard.innerHTML = '';
  const symbols = difficulty[currentDifficulty].split('');

  symbols.forEach(symbol => {
    const keyElement = document.createElement('button');
    keyElement.textContent = symbol;
    keyElement.classList.add('key');
    keyElement.addEventListener('click', () => handleKeyPress(symbol));
    virtualKeyboard.appendChild(keyElement);
  });
}

function handleKeyPress(symbol) {
  console.log(`Key pressed: ${symbol}`);
  // проверка правильности нажатия
}

startButton.addEventListener('click', () => {
  currentRound = 0;
  sequence = [];
  nextRound();
});

function nextRound() {
  if (currentRound < 5) {
    const length = 2 + currentRound * 2; // длина последовательности
    const symbols = difficultySymbols[currentDifficulty];

    sequence.push(symbols.charAt(Math.floor(Math.random() * symbols.length)));
    console.log(`Sequence for round ${currentRound + 1}: ${sequence.join('')}`);
    currentRound++;
  } else {

  }
}

// Инициализация клавы
window.onload = generateVirtualKeyboard;
