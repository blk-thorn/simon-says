import { getActiveKeys, findKey } from './keyboard/keyboardSelectors.js';
import { stepPlayer } from './stepPlayer.js';
import { lockUI } from './lockUI.js';

export function sequencePlayer(sequence, length, state) {
    const keys = getActiveKeys();
    lockUI();
    state.inputBlocked = true;

    sequence.forEach((symbol, index) => {
        const key = findKey(keys, symbol);
        if (!key) return;

        stepPlayer(key, index, index === length - 1);
    });
}
