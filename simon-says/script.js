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
let inputBlocked = true;


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
    display.value = '';
    repeatButton.disabled = true;
    repeat();
  });

  nextButton.addEventListener('click', () => {
    display.value = '';
    nextRound();

    repeatButton.disabled = false;
    inputBlocked = false;
    nextButton.style.display = 'none';
    document.querySelector('h2').textContent = `Round: ${currentRound} / 5`;
  })
  newGame.addEventListener('click', () => {
    display.value = "";
    sequence = [];
    pressedKeys = [];
    currentRound = 1;
    document.querySelector('h2').textContent = `Round: ${currentRound} / 5`;

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
    if(inputBlocked) {
      button.style.backgroundColor = '#ddd';
    }
  }
}

function normalizeSymbol(symbol) {
  const symbolsMap = {
    'Q': 'Й', 'W': 'Ц', 'E': 'У', 'R': 'К', 'T': 'Е', 'Y': 'Н', 'U': 'Г', 'I': 'Ш', 'O': 'Щ', 'P': 'З',
    'A': 'Ф', 'S': 'Ы', 'D': 'В', 'F': 'А', 'G': 'П', 'H': 'Р', 'J': 'О', 'K': 'Л', 'L': 'Д',
    'Z': 'Я', 'X': 'Ч', 'C': 'С', 'V': 'М', 'B': 'И', 'N': 'Т', 'M': 'Ь',

    'Й': 'Q', 'Ц': 'W', 'У': 'E', 'К': 'R', 'Е': 'T', 'Н': 'Y', 'Г': 'U', 'Ш': 'I', 'Щ': 'O', 'З': 'P',
    'Ф': 'A', 'Ы': 'S', 'В': 'D', 'А': 'F', 'П': 'G', 'Р': 'H', 'О': 'J', 'Л': 'K', 'Д': 'L',
    'Я': 'Z', 'Ч': 'X', 'С': 'C', 'М': 'V', 'И': 'B', 'Т': 'N', 'Ь': 'M'
  };

  return symbolsMap[symbol] || symbol;
}


function handleKeyPress(symbol) {
  const keySymbol = normalizeSymbol(symbol.toUpperCase());

  if (inputBlocked) return;

  const validKeys = difficulty[currentDifficulty].split('');

  if (!keyPressedOnce && validKeys.includes(keySymbol)) {
    pressedKeys.push(keySymbol);
    display.value = pressedKeys.join(' ');
    compareSymbols();
    keyPressedOnce = true;
  } else {
    // console.log(`Key rejected: ${keySymbol}`);
  }

  setTimeout(() => {
    keyPressedOnce = false;
  }, 50);
}


function compareSymbols() {
  const nextButton = document.getElementById('next');
  const repeatButton = document.getElementById('repeat sequence');

  const normalizedSequence = sequence.map(normalizeSymbol);
  if (pressedKeys.length === normalizedSequence.length) {
    inputBlocked = true;
    if (isArraysEqual(pressedKeys, normalizedSequence)) {
      setTimeout(() => {
        display.value = "Correct!";
      }, 300);
      currentRound++;
      nextButton.style.display = 'flex';
      nextButton.disabled = false;
      repeatButton.style.display = 'none';
      repeatButton.disabled = true;
    } else if (tryCount === 2) {
      setTimeout(() => {
        display.value = "You lose!";
      }, 300);
      pressedKeys = [];
      nextButton.disabled = true;
      repeatButton.disabled = true;
      inputBlocked = true;
    } else {
      setTimeout(() => {
        display.value = "Wrong sequence!";
      }, 300);
      tryCount++;
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

  inputBlocked = true;

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
      if (index === length - 1) {
        inputBlocked = false;
      }
    }, index * 1000 + 800);
})

  // display.value = sequence.join(' ');
  console.log(`Current sequence: ${sequence.join(' ')}`);
  recentSequence = sequence;
}


function nextRound() {
  document.getElementById('repeat sequence').style.display = 'flex';
  pressedKeys = [];
  tryCount = 1;
  if(currentRound < 5) {
    startGame();
  }
}



function repeat() {
  const activeKeys = document.querySelectorAll('.key');
  inputBlocked = true;

  recentSequence.forEach((item, index) => {
    const keyToActivate = Array.from(activeKeys).find(key => key.textContent === item);

    setTimeout(() => {
      keyToActivate.classList.add('key--active');
    }, index * 1000);

    setTimeout(() => {
      keyToActivate.classList.remove('key--active');
      if (index === recentSequence.length - 1) {
        inputBlocked = false;
      }
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

  const controlButtons = ['New game', 'Repeat sequence', "Next"];

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

