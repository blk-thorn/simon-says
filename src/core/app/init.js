import {DOM, initDOM} from "../constants/dom.js";
import {state} from "../state/state.js";
import {DIFFICULTY_KEYS} from "../constants/config.js";
import {nextRound, repeat, startGame} from "../game/gameLogic.js";
import {clearDisplay} from "../../utils/clearDisplay.js";
import {handleKeyPress} from "../../ui/keyboard/keyboardInput.js";
import {ACTIVE_COLOR} from "../constants/colors.js";
import {generateVirtualKeyboard} from "../../ui/keyboard/virtualKeyboard.js";
import {changeButtonColor} from "../../ui/keyboard/keyEffects.js";
import { renderLayout } from "../../ui/renderLayout.js";

export function init() {
    renderLayout();
    initDOM();
    generateVirtualKeyboard();

    DOM.buttons.easy.classList.add('key--active');

    DOM.buttons.easy.addEventListener('click', () => {
        state.currentDifficulty = DIFFICULTY_KEYS.easy;
        generateVirtualKeyboard();
        DOM.buttons.hard.classList.remove('key--active');
        DOM.buttons.medium.classList.remove('key--active');
        DOM.buttons.easy.classList.add('key--active');
    });

    DOM.buttons.medium.addEventListener('click', () => {
        state.currentDifficulty = DIFFICULTY_KEYS.medium;
        generateVirtualKeyboard();
        DOM.buttons.hard.classList.remove('key--active');
        DOM.buttons.easy.classList.remove('key--active');
        DOM.buttons.medium.classList.add('key--active');
    });

    DOM.buttons.hard.addEventListener('click', () => {
        state.currentDifficulty = DIFFICULTY_KEYS.hard;
        generateVirtualKeyboard();
        DOM.buttons.easy.classList.remove('key--active');
        DOM.buttons.medium.classList.remove('key--active');
        DOM.buttons.hard.classList.add('key--active');
    });

    DOM.buttons.start.addEventListener('click', () => {
        document.querySelector('.subtitle').textContent = `Round: ${state.currentRound} / 5`;
        state.sequence = [];
        state.pressedKeys = [];
        state.tryCount = 1;
        startGame();
        DOM.buttons.start.classList.add('hidden');
        DOM.buttons.repeat.style.display = 'flex';
        DOM.buttons.new.style.display = 'flex';
        DOM.buttons.start.disabled = true;
    });

    DOM.buttons.repeat.addEventListener('click', () => {
        clearDisplay();
        DOM.buttons.repeat.disabled = true;
        repeat();
    });

    DOM.buttons.next.addEventListener('click', () => {
        clearDisplay();
        nextRound();

        DOM.buttons.repeat.disabled = false;
        state.inputBlocked = true;
        DOM.buttons.next.style.display = 'none';
        document.querySelector('.subtitle').textContent = `Round: ${state.currentRound} / 5`;
    })
    DOM.buttons.new.addEventListener('click', () => {
        clearDisplay();
        state.sequence = [];
        state.pressedKeys = [];
        state.currentRound = 1;
        state.tryCount = 1;
        state.inputBlocked = true;
        document.querySelector('.subtitle').textContent = 'Repeat after me';

        DOM.buttons.start.disabled = false;
        DOM.buttons.repeat.disabled = false;
        DOM.buttons.easy.disabled = false;
        DOM.buttons.medium.disabled = false;
        DOM.buttons.hard.disabled = false;

        DOM.buttons.start.classList.remove('hidden');
        DOM.buttons.repeat.style.display = 'none';
        DOM.buttons.new.style.display = 'none';
        DOM.buttons.next.style.display = 'none';
    });

    document.addEventListener('keydown', (event) => {
        const keySymbol = event.code.replace('Key', '').replace('Digit', '').toUpperCase();
        if(state.inputBlocked) {
            changeButtonColor(keySymbol, '');
            return;
        }
        if (state.keyPressedOnce || state.activeKey === keySymbol) {
            return;
        }
        resetButtonColors();
        handleKeyPress(keySymbol);
        changeButtonColor(keySymbol, ACTIVE_COLOR);

        state.keyPressedOnce = true;
        state.activeKey = keySymbol;
    });

    document.addEventListener('keyup', (event) => {
        const keySymbol = event.key.toUpperCase();
        if(state.inputBlocked) {
            changeButtonColor(keySymbol, '');
            return;
        }
        changeButtonColor(keySymbol, '');
        if (state.activeKey === keySymbol) {
            state.keyPressedOnce = false;
            state.activeKey = null;
        }
    });

    function resetButtonColors() {
        const keys = document.querySelectorAll('.key');
        keys.forEach(key => {
            key.style.backgroundColor = '';
        });

    }
}

