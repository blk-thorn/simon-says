import {DOM} from "../core/constants/dom.js";


export function renderLayout() {

    const h1 = document.createElement('h1');
    h1.textContent = 'Simon Says Game';
    h1.className = 'title';

    const h2 = document.createElement('h2');
    h2.textContent = 'Repeat after me';
    h2.className = 'subtitle';

    const main = document.createElement('main');
    main.className = 'main';

    DOM.display = document.createElement('input');
    DOM.display.className = 'display';
    DOM.display.id = 'display';
    DOM.display.setAttribute('readonly', true);

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
        button.id = name.toLowerCase().split(' ')[0];
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
    virtualKeyboard.id = 'keyboard';
    virtualKeyboard.className = 'keyboard';


    DOM.body.append(h1);
    DOM.body.append(h2)
    main.append(ul);
    main.append(DOM.display);
    main.append(ul2);
    DOM.body.append(main);
    buttonContainer.append(startButton);
    DOM.body.append(buttonContainer);
    DOM.body.append(virtualKeyboard);
}

