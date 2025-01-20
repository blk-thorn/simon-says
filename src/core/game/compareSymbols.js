import {state} from "../state/state.js";
import {isArraysEqual} from "../../utils/array.js";
import {DOM} from "../constants/dom.js";

export function compareSymbols() {
    let hasErrors = false;

    const minLength = Math.min(state.pressedKeys.length, state.sequence.length);
    for (let i = 0; i < minLength; i++) {
        if (state.pressedKeys[i] !== state.sequence[i]) {
            hasErrors = true;
            break;
        }
    }

    if (!hasErrors && state.pressedKeys.length === state.sequence.length) {
        state.inputBlocked = true;
        if (isArraysEqual(state.pressedKeys, state.sequence)) {
            DOM.buttons.next.style.display = 'flex';
            DOM.buttons.next.disabled = false;
            DOM.buttons.repeat.style.display = 'none';
            DOM.buttons.repeat.disabled = true;

            setTimeout(() => {
                DOM.display.value = "Correct!";
            }, 200);

            if (state.currentRound === 5) {
                DOM.buttons.next.disabled = true;
                DOM.buttons.next.style.display = 'none';
                DOM.buttons.repeat.style.display = 'flex';
                DOM.buttons.repeat.disabled = true;
                setTimeout(() => {
                    DOM.display.value =  "You won!";
                }, 200);
            }
            state.currentRound++;
            if (state.currentRound > 5) {
                DOM.buttons.next.disabled = true;
                DOM.buttons.next.style.display = 'none';
            }
        }
    }

    if(hasErrors) {
        if (state.tryCount < 2) {
            setTimeout(() => {
                DOM.display.value = "Wrong sequence!";
            }, 200);
            state.pressedKeys = [];
            DOM.buttons.next.disabled = true;
            state.inputBlocked = true;
        }

        if (state.tryCount === 2) {
            setTimeout(() => {
                DOM.display.value =  "You lose!";
            }, 200);
            state.pressedKeys = [];
            DOM.buttons.next.disabled = true;
            DOM.buttons.repeat.disabled = true;
            state.inputBlocked = true;
        }
    }
}
