const body = document.querySelector("body");
let display;

const activeColor = 'rgba(225, 0, 0, 0.5)'


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

let tryCount = 1;
let keyPressedOnce = false;
let inputBlocked = false;


window.onload = init;


function init() {
  createElements();
  generateVirtualKeyboard();


  const easyButton = document.getElementById('easy');
  const mediumButton = document.getElementById('medium');
  const hardButton = document.getElementById('hard');

  const startButton = document.getElementById('start');
  const repeatButton  = document.getElementById('repeat sequence');
  const newGame = document.getElementById('new game');
  const nextButton = document.getElementById('next');

  easyButton.classList.add('key--active');

  easyButton.addEventListener('click', () => {
    currentDifficulty = 'easy';
    generateVirtualKeyboard();
    mediumButton.classList.remove('key--active');
    hardButton.classList.remove('key--active');
    easyButton.classList.add('key--active');
  });

  mediumButton.addEventListener('click', () => {
    currentDifficulty = 'medium';
    generateVirtualKeyboard();
    easyButton.classList.remove('key--active');
    hardButton.classList.remove('key--active');
    mediumButton.classList.add('key--active');
  });

  hardButton.addEventListener('click', () => {
    currentDifficulty = 'hard';
    generateVirtualKeyboard();
    easyButton.classList.remove('key--active');
    mediumButton.classList.remove('key--active');
    hardButton.classList.add('key--active');
  });

  startButton.addEventListener('click', () => {
    sequence = [];
    pressedKeys = [];
    startGame();
    // startButton.style.display = 'none';
    startButton.classList.add('hidden');
    repeatButton.style.display = 'flex';
    newGame.style.display = 'flex';
    startButton.disabled = true;
  });

  repeatButton.addEventListener('click', () => {
    repeatButton.disabled = true;
    inputBlocked = false;
    repeat();
    display.value = '';
  });

  nextButton.addEventListener('click', () => {
    nextRound();
    repeatButton.disabled = false;
    inputBlocked = false;
    nextButton.style.display = 'none';
  });

  newGame.addEventListener('click', () => {
    display.value = "";
    sequence = [];
    pressedKeys = [];
    startButton.disabled = false;
    repeatButton.disabled = false;
    easyButton.disabled = false;
    mediumButton.disabled = false;
    hardButton.disabled = false;
    inputBlocked = false;

    startButton.classList.remove('hidden');
    repeatButton.style.display = 'none';
    newGame.style.display = 'none';
    nextButton.style.display = 'none';
  });

  document.addEventListener('keydown', (event) => {
    if (inputBlocked) return;
    const key = event.key.toUpperCase();
    handleKeyPress(key);
  });

}

function generateVirtualKeyboard() {
 const virtualKeyboard = document.getElementById('virtual-keyboard');
  if (!virtualKeyboard) {
    console.error('Virtual keyboard not found');
    return;
  }

  virtualKeyboard.innerHTML = '';
  const symbols = difficulty[currentDifficulty].split('');

  symbols.forEach(symbol => {
    const keyElement = document.createElement('button');
    keyElement.textContent = symbol;
    keyElement.classList.add('key');
    keyElement.dataset.key = symbol;

    keyElement.addEventListener('click', () => {
      handleKeyPress(symbol);
      changeButtonColor(symbol, activeColor);
    });

    keyElement.addEventListener('mousedown', () => {
      changeButtonColor(symbol, activeColor);
    });

    keyElement.addEventListener('mouseup', () => {
      changeButtonColor(symbol, '');
    });


    keyElement.addEventListener('mouseleave', () => {
      changeButtonColor(symbol, '');
    });

    virtualKeyboard.appendChild(keyElement);
  });

  document.addEventListener('keydown', (event) => {
    const keySymbol = event.key.toUpperCase();
    changeButtonColor(keySymbol, activeColor);
  });

  document.addEventListener('keyup', (event) => {
    const keySymbol = event.key.toUpperCase();
    changeButtonColor(keySymbol, '');
  });
}

function changeButtonColor(key, color) {
  const button = document.querySelector(`.key[data-key="${key}"]`);
  if (button) {
    button.style.backgroundColor = color;
  }
}

function handleKeyPress(symbol) {
  const keySymbol = symbol.toUpperCase();

  if (inputBlocked) return;

  console.log('Current Difficulty:', currentDifficulty);

  const validKeys = difficulty[currentDifficulty];
  console.log('Valid keys:', validKeys);

  if (!keyPressedOnce && validKeys.includes(keySymbol)) {
    console.log(`Key accepted: ${keySymbol}`);
    pressedKeys.push(keySymbol);
    display.value = pressedKeys.join(' ');

    compareSymbols();
    keyPressedOnce = true;
  } else {
    console.log(`Key rejected: ${keySymbol}`);
  }

  setTimeout(() => {
    keyPressedOnce = false;
  }, 50);
}



function compareSymbols() {
  const nextButton = document.getElementById('next');
  const repeatButton = document.getElementById('repeat sequence');
  if (pressedKeys.length === sequence.length) {
    inputBlocked = true;
    if (isArraysEqual(pressedKeys, sequence)) {
      setTimeout(() => {
        display.value = "Correct!";
      }, 300);
      // currentRound++;
      nextButton.style.display = 'flex';
      nextButton.disabled = false;
      repeatButton.disabled = true;
      // setTimeout(() => {
      //   // nextRound();
      //   document.querySelector('h2').textContent = `Round: ${currentRound} / 5`;
      // }, 1000);
    } else if (tryCount === 2) {
      setTimeout(() => {
        display.value = "You loose!";
      }, 300);
      pressedKeys = [];
      nextButton.disabled = true;
      repeatButton.disabled = true;
      // inputBlocked = true;
    } else {
      setTimeout(() => {
        display.value = "Wrong sequence!";
      }, 300);
      tryCount++
      pressedKeys = [];
      nextButton.disabled = true;
    }
  }
}

function isArraysEqual(arr1, arr2) {
  return arr1.toString() === arr2.toString();
}

function startGame() {
  const length = currentRound * 2;
  const symbols = difficulty[currentDifficulty];

  document.getElementById('easy').disabled = true;
  document.getElementById('medium').disabled = true;
  document.getElementById('hard').disabled = true;


  sequence = [];
  tryCount = 1;

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

  // display.value = sequence.join(' ');
  console.log(`Current sequence: ${sequence.join(' ')}`);
  recentSequence = sequence;
}

function nextRound() {
  pressedKeys = [];
  tryCount = 1;
  currentRound++;

  setTimeout(() => {
    // nextRound();
    document.querySelector('h2').textContent = `Round: ${currentRound} / 5`;
  }, 1000);
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

  const h2 = document.createElement('h2');
  h2.textContent = `Round: ${currentRound} / 5`;

  const main = document.createElement('main');
  main.className = 'main';

  display = document.createElement('input');
  display.className = 'display';
  display.setAttribute('readonly', true);

  const ul = document.createElement('ul');
  ul.className = 'level__list';
  ul.id = 'levels';

  const ul2 = document.createElement('ul');
  ul2.className = 'control__list';
  ul2.id = 'controls';

  const levelButtons = ['Easy', 'Medium', 'Hard'];

  levelButtons.forEach(name => {
    const li = document.createElement('li');
    li.className = 'level__item';

    const button = document.createElement('button');
    button.className = 'level__button';
    button.id = name.toLowerCase();
    button.textContent = name;

    li.append(button);
    ul.append(li);

  });

  const controlButtons = ['Repeat sequence', 'New game', "Next"];

  controlButtons.forEach((name, index) => {
    const li = document.createElement('li');
    li.className = 'control__item';

    const button = document.createElement('button');
    button.className = 'control__button';
    button.id = name.toLowerCase();
    button.textContent = name;

    button.style.display = 'none';

    li.append(button);
    ul2.append(li);
  });

  const startButton = document.createElement('button');
  startButton.id = 'start';
  startButton.className = 'start-button';
  startButton.textContent = 'Start';

  const virtualKeyboard = document.createElement('div');
  virtualKeyboard.id = 'virtual-keyboard';
  virtualKeyboard.className = 'virtual-keyboard';


  body.append(h1);
  body.append(h2)
  main.append(ul);
  main.append(display);
  main.append(ul2);
  body.append(main);
  body.append(startButton);
  body.append(virtualKeyboard);
}

