const body = document.querySelector("body");
body.className = 'body';

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
    tryCount = 1;
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
    inputBlocked = true;
    nextButton.style.display = 'none';
    document.querySelector('h2').textContent = `Round: ${currentRound} / 5`;
  })
  newGame.addEventListener('click', () => {
    display.value = "";
    sequence = [];
    pressedKeys = [];
    currentRound = 1;
    tryCount = 1;
    document.querySelector('h2').textContent = `Round: ${currentRound} / 5`;

    startButton.disabled = false;
    repeatButton.disabled = false;
    easyButton.disabled = false;
    mediumButton.disabled = false;
    hardButton.disabled = false;

    startButton.classList.remove('hidden');
    repeatButton.style.display = 'none';
    newGame.style.display = 'none';
    nextButton.style.display = 'none';
  });

  document.addEventListener('keydown', (event) => {
    const keySymbol = event.code.replace('Key', '').replace('Digit', '').toUpperCase();
    if(inputBlocked) {
      changeButtonColor(keySymbol, '');
      return;
    }
    handleKeyPress(keySymbol);
    changeButtonColor(keySymbol, activeColor);
  });

  document.addEventListener('keyup', (event) => {
    const keySymbol = event.key.toUpperCase();
    if(inputBlocked) {
      changeButtonColor(keySymbol, '');
      return;
    }
    changeButtonColor(keySymbol, '');
  });
}

function generateVirtualKeyboard() {
  const virtualKeyboard = document.getElementById('virtual-keyboard');
  if (virtualKeyboard) {
    virtualKeyboard.innerHTML = '';
    const symbols = difficulty[currentDifficulty].split('');

    symbols.forEach(symbol => {
      const keyElement = document.createElement('button');
      keyElement.textContent = symbol;
      keyElement.classList.add('key');
      keyElement.dataset.key = symbol;

      keyElement.addEventListener('click', () => {
        if(inputBlocked) return;
        handleKeyPress(symbol);
        changeButtonColor(symbol, activeColor);
      });

      keyElement.addEventListener('mousedown', () => {
        if(inputBlocked) return;
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
}
}

function changeButtonColor(key, color) {
  const button = document.querySelector(`.key[data-key="${key}"]`);
  if (button) {
    button.style.backgroundColor = color;
  }

}


function handleKeyPress(keySymbol) {
  console.log(`Key pressed: ${keySymbol}`);

  if (inputBlocked) return;

  const validKeys = difficulty[currentDifficulty];

  const isNumberKey = !isNaN(Number(keySymbol));

  if (!keyPressedOnce && (validKeys.includes(keySymbol) || (isNumberKey && validKeys.includes(keySymbol)))) {
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

  let hasErrors = false;

  const minLength = Math.min(pressedKeys.length, sequence.length);
  for (let i = 0; i < minLength; i++) {
    if (pressedKeys[i] !== sequence[i]) {
      hasErrors = true;
      break;
    }
  }

  if (!hasErrors && pressedKeys.length === sequence.length) {
    inputBlocked = true;
    if (isArraysEqual(pressedKeys, sequence)) {
      nextButton.style.display = 'flex';
      nextButton.disabled = false;
      repeatButton.style.display = 'none';
      repeatButton.disabled = true;

      setTimeout(() => {
        display.value = "Correct!";
      }, 200);

      if (currentRound === 5) {
        nextButton.disabled = true;
        nextButton.style.display = 'none';
        repeatButton.style.display = 'flex';
        repeatButton.disabled = true;
        setTimeout(() => {
          display.value = "You won!";
        }, 200);
      }
      currentRound++;
      if (currentRound > 5) {
        nextButton.disabled = true;
        nextButton.style.display = 'none';
      }
    }
  }

  if(hasErrors) {
    if (tryCount < 2) {
      setTimeout(() => {
        display.value = "Wrong sequence!";
      }, 200);
      pressedKeys = [];
      nextButton.disabled = true;
      inputBlocked = true;
    }

    if (tryCount === 2) {
      setTimeout(() => {
        display.value = "You lose!";
      }, 200);
      pressedKeys = [];
      nextButton.disabled = true;
      repeatButton.disabled = true;
      inputBlocked = true;
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


  for(let i =  0; i < length; i++) {
    sequence.push(symbols.charAt(Math.floor(Math.random() * symbols.length)));
  }

  const activeKeys = document.querySelectorAll('.key');

  sequence.forEach((item, index) => {
    const keyToActivate = Array.from(activeKeys).find(key => key.textContent === item);

    setTimeout(() => {
      document.getElementById('repeat sequence').disabled = true;
      document.getElementById('new game').disabled = true;
      // keyToActivate.classList.add('key--active');
      keyToActivate.style.backgroundColor = activeColor;
    }, index * 1000);

    setTimeout(() => {
      // keyToActivate.classList.remove('key--active');
      keyToActivate.style.backgroundColor = 'rgba(47, 79, 79, 0.1)';
      if (index === length - 1) {
        inputBlocked = false; // Разблокировка ввода здесь!!!
        document.getElementById('repeat sequence').disabled = false;
        document.getElementById('new game').disabled = false;
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
  if(currentRound <= 5) {
    startGame();
  }
}


function repeat() {
  const activeKeys = document.querySelectorAll('.key');
  inputBlocked = true;
 tryCount++;

  recentSequence.forEach((item, index) => {
    const keyToActivate = Array.from(activeKeys).find(key => key.textContent === item);

    setTimeout(() => {
      document.getElementById('repeat sequence').disabled = true;
      document.getElementById('new game').disabled = true;
        keyToActivate.style.backgroundColor = activeColor;
      // keyToActivate.classList.add('key--active');
    }, index * 1000);

    setTimeout(() => {
      // keyToActivate.classList.remove('key--active');
      // keyToActivate.style.backgroundColor = '#ddd';
      keyToActivate.style.backgroundColor = 'rgba(47, 79, 79, 0.1)';
      if (index === recentSequence.length - 1) {
        inputBlocked = false; // Разблокировка ввода здесь!!!
        document.getElementById('new game').disabled = false;
      }
    }, index * 1000 + 800);
  })
}


function createElements() {
  const h1 = document.createElement('h1');
  h1.textContent = 'Simon Says Game';
  h1.className = 'title';

  const h2 = document.createElement('h2');
  h2.textContent = `Round: ${currentRound} / 5`;
  h2.className = 'subtitle';

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

  const buttonContainer = document.createElement('div');
  buttonContainer.className = 'button-container';

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
  buttonContainer.append(startButton);
  body.append(buttonContainer);
  body.append(virtualKeyboard);
}

