const body = document.querySelector("body");
let display;


const difficulty = {
  easy: '0123456789',
  medium: 'QWERTYUIOPASDFGHJKLZXCVBNM',
  hard: '0123456789QWERTYUIOPASDFGHJKLZXCVBNM'
};

let sequence = [];
let recentSequence = [];
let pressedKeys = [];
let currentRound = 1;
let currentDifficulty = 'easy';


window.onload = init;


function init() {
  createElements();
  generateVirtualKeyboard();

  const display = document.querySelector('.display');

  const easyButton = document.getElementById('easy');
  const mediumButton = document.getElementById('medium');
  const hardButton = document.getElementById('hard');

  const startButton = document.getElementById('start');
  const repeatButton = document.getElementById('repeat');

  easyButton.addEventListener('click', () => {
    currentDifficulty = 'easy';
    generateVirtualKeyboard();
  });

  mediumButton.addEventListener('click', () => {
    currentDifficulty = 'medium';
    generateVirtualKeyboard();
  });

  hardButton.addEventListener('click', () => {
    currentDifficulty = 'hard';
    generateVirtualKeyboard();
  });

  startButton.addEventListener('click', () => {
    console.log(currentRound);
    sequence = [];
    pressedKeys = [];
    startGame();
  });

  repeatButton.addEventListener('click', () => {
    repeat();
  });
}

function generateVirtualKeyboard() {
 const virtualKeyboard = document.getElementById('virtual-keyboard');
  if (!virtualKeyboard) {
    console.error('Element virtual-keyboard not found');
    return;
  }

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

  pressedKeys.push(symbol);
  display.value = pressedKeys;

  if (pressedKeys.length === sequence.length) {
    if (isArraysEqual(pressedKeys, sequence)) {
      console.log("Правильная последовательность:", pressedKeys);
      currentRound++;
      setTimeout(() => {
        nextRound();
      },1000);
    } else {
      console.log("Неправильная последовательность");
      pressedKeys = [];
    }
  }
}

function isArraysEqual(arr1, arr2) {
  return arr1.toString() === arr2.toString();
}

function startGame() {
  const length = currentRound * 2;
  const symbols = difficulty[currentDifficulty];
  sequence = [];

  for(let i =  0; i < length; i++) {
    sequence.push(symbols.charAt(Math.floor(Math.random() * symbols.length)));
  }

  const activeKeys = document.querySelectorAll('.key');

  sequence.forEach((item, index) => {
    const keyToActivate = Array.from(activeKeys).find(key => key.textContent === item);

    setTimeout(() => {
      keyToActivate.classList.add('key--active');
    }, index * 1000);

    setTimeout(() => {
      keyToActivate.classList.remove('key--active');
    }, index * 1000 + 800);
})

  display.value = sequence.join(' ');
  recentSequence = sequence;
}

function nextRound() {
  pressedKeys = [];
  if(currentRound < 5) {
    startGame();
  }
}
function repeat() {
  const activeKeys = document.querySelectorAll('.key');

  recentSequence.forEach((item, index) => {
    const keyToActivate = Array.from(activeKeys).find(key => key.textContent === item);

    setTimeout(() => {
      keyToActivate.classList.add('key--active');
    }, index * 1000);

    setTimeout(() => {
      keyToActivate.classList.remove('key--active');
    }, index * 1000 + 800);
  })
}


function createElements() {
  const h1 = document.createElement('h1');
  h1.textContent = 'Simon Says Game';

  const ul = document.createElement('ul');
  ul.className = 'control__list';
  ul.id = 'controls';

  const buttonNames = ['Easy', 'Medium', 'Hard', 'Start', 'Repeat'];

  buttonNames.forEach(name => {
    const li = document.createElement('li');
    li.className = 'control__item';

    const button = document.createElement('button');
    button.className = 'control__button';
    button.id = name.toLowerCase();
    button.textContent = name;

    li.appendChild(button);
    ul.appendChild(li);
  });

  const virtualKeyboard = document.createElement('div');
  virtualKeyboard.id = 'virtual-keyboard';
  virtualKeyboard.className = 'virtual-keyboard';

  display = document.createElement('input');
  display.className = 'display';


  body.appendChild(h1);
  body.append(display);
  body.appendChild(ul);
  body.appendChild(virtualKeyboard);
}

