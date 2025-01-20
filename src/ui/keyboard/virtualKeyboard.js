import {DIFFICULTY} from "../../core/constants/difficulty.js";
import {handleKeyPress} from "./keyboardInput.js";
import {changeButtonColor} from "./keyEffects.js";
import {state} from "../../core/state/state.js";
import {ACTIVE_COLOR} from "../../core/constants/colors.js";
import {DOM} from "../../core/constants/dom.js";

export function generateVirtualKeyboard() {
    if (DOM.keyboard) {
        DOM.keyboard.innerHTML = '';
        const symbols = DIFFICULTY[state.currentDifficulty].split('');

        symbols.forEach(symbol => {
            const keyElement = document.createElement('button');
            keyElement.textContent = symbol;
            keyElement.classList.add('key');
            keyElement.dataset.key = symbol;

            keyElement.addEventListener('click', () => {
                if(state.inputBlocked) return;
                handleKeyPress(symbol);
                changeButtonColor(symbol, ACTIVE_COLOR);
            });

            keyElement.addEventListener('mousedown', () => {
                if(state.inputBlocked) return;
                changeButtonColor(symbol, ACTIVE_COLOR);
            });

            keyElement.addEventListener('mouseup', () => {
                changeButtonColor(symbol, '');
            });

            keyElement.addEventListener('mouseleave', () => {
                changeButtonColor(symbol, '');
            });

            DOM.keyboard.appendChild(keyElement);
        });
    }
}
