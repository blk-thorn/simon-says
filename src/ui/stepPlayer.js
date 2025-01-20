import { activateKey, deactivateKey } from './keyboard/keyEffects.js';
import { unlockUI } from './lockUI.js';
import { ACTIVE_COLOR } from '../core/constants/colors.js';
import {state} from "../core/state/state.js";

export function stepPlayer(key, index, isLast) {
    setTimeout(() => {
        activateKey(key, ACTIVE_COLOR);
    }, index * 1000);

    setTimeout(() => {
        deactivateKey(key);
        if (isLast) {
            state.inputBlocked = false;
            unlockUI();
        }
    }, index * 1000 + 800);
}
