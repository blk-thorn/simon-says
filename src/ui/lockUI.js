import {DOM} from "../core/constants/dom.js";

export function lockUI() {
    DOM.buttons.repeat.disabled = true;
    DOM.buttons.new.disabled = true;
}

export function unlockUI() {
    DOM.buttons.repeat.disabled = false;
    DOM.buttons.new.disabled = false;
}

export function lockLevel() {
    DOM.buttons.easy.disabled = true;
    DOM.buttons.medium.disabled = true;
    DOM.buttons.hard.disabled = true;
}
