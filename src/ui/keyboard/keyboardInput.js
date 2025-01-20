import {state} from "../../core/state/state.js";
import {DIFFICULTY} from "../../core/constants/difficulty.js";
import {compareSymbols} from "../../core/game/compareSymbols.js";
import {DOM} from "../../core/constants/dom.js";

export function handleKeyPress(keySymbol) {
    console.log(`Key pressed: ${keySymbol}`);

    if (state.inputBlocked) return;

    const validKeys = DIFFICULTY[state.currentDifficulty];

    const isNumberKey = !isNaN(Number(keySymbol));

    if (!state.keyPressedOnce && (validKeys.includes(keySymbol) || (isNumberKey && validKeys.includes(keySymbol)))) {
        state.pressedKeys.push(keySymbol);
        DOM.display.value = state.pressedKeys.join(' ');
        compareSymbols();
        state.keyPressedOnce = true;
    }

    setTimeout(() => {
        state.keyPressedOnce = false;
    }, 50);
}
