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

let tryCount = 1;


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
    mediumButton.disabled = true;
    hardButton.disabled = true;
    startButton.style.display = 'none';
    repeatButton.style.display = 'flex';
    newGame.style.display = 'flex';
  });

  repeatButton.addEventListener('click', () => {
    repeatButton.disabled = true;
    repeat();
  });

  nextButton.addEventListener('click', () => {
    nextRound();
  });

  newGame.addEventListener('click', () => {
    sequence = [];
    pressedKeys = [];
    startButton.style.display = 'flex';
    repeatButton.style.display = 'none';
    newGame.style.display = 'none';
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
  const nextButton = document.getElementById('next');
  pressedKeys.push(symbol);
  display.value = pressedKeys;

  if (pressedKeys.length === sequence.length) {
    if (isArraysEqual(pressedKeys, sequence)) {
      display.value = "Correct!";
      currentRound++;
      setTimeout(() => {
        nextButton.style.display = 'flex';
        // nextRound();
        document.querySelector('h2').textContent = `Round: ${currentRound}`;
        document.getElementById('repeat').disabled = false;
      },1000);
    } else if(tryCount === 2) {
      document.getElementById('start').style.display = 'flex';
      display.value = "You loose!";
      pressedKeys = [];
    } else {
      display.value = "Wrong sequence!";
      tryCount++
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

  display.value = sequence.join(' ');
  recentSequence = sequence;
}

function nextRound() {
  pressedKeys = [];
  tryCount = 1;

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
  h2.textContent = `Round: ${currentRound}`;

  const ul = document.createElement('ul');
  ul.className = 'level__list';
  ul.id = 'levels';

  const ul2 = document.createElement('ul');
  ul2.className = 'control__list';
  ul2.id = 'controls';

  const levelButtons = ['Easy', 'Medium', 'Hard', 'Start'];

  levelButtons.forEach(name => {
    const li = document.createElement('li');
    li.className = 'level__item';

    const button = document.createElement('button');
    button.className = 'level__button';
    button.id = name.toLowerCase();
    button.textContent = name;

    li.appendChild(button);
    ul.appendChild(li);
  });

  const controlButtons = [ 'Repeat sequence', 'New game', "Next"];

  controlButtons.forEach((name, index) => {
    const li = document.createElement('li');
    li.className = 'control__item';

    const button = document.createElement('button');
    button.className = 'control__button';
    button.id = name.toLowerCase();
    button.textContent = name;

    button.style.display = 'none';

    li.appendChild(button);
    ul2.appendChild(li);
  });

  const virtualKeyboard = document.createElement('div');
  virtualKeyboard.id = 'virtual-keyboard';
  virtualKeyboard.className = 'virtual-keyboard';

  display = document.createElement('input');
  display.className = 'display';


  body.append(h1);
  body.append(h2)
  body.append(display);
  body.append(ul);
  body.append(ul2);
  body.append(virtualKeyboard);
}

