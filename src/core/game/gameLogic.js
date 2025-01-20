import {state} from "../state/state.js";
import {sequencePlayer} from "../../ui/sequencePlayer.js";
import {lockLevel, lockUI} from "../../ui/lockUI.js";
import {generateSequence} from "../../utils/sequence.js";
import {DIFFICULTY} from "../constants/difficulty.js";
import {DOM} from "../constants/dom.js";

export function startGame() {
    const length = state.currentRound * 2;
    const symbols = DIFFICULTY[state.currentDifficulty];

    lockLevel();
    state.inputBlocked = true;
    state.sequence = generateSequence(symbols, length);
    sequencePlayer(state.sequence, length, state);
    state.recentSequence = state.sequence;
    console.log(`Current sequence: ${state.sequence.join(' ')}`);
}


export function nextRound() {
    DOM.buttons.repeat.style.display = 'flex';
    state.pressedKeys = [];
    state.tryCount = 1;
    if(state.currentRound <= 5) {
        startGame();
    }
}


export function repeat() {
    state.inputBlocked = true;
    state.tryCount++;

    state.recentSequence.forEach((item, index) => {
        state.inputBlocked = true;
        state.tryCount++;

        lockUI();

        const length = state.recentSequence.length;

        sequencePlayer(state.recentSequence, length, state);
    })
}
