export function getActiveKeys() {
    return document.querySelectorAll('.key');
}

export function findKey(keys, symbol) {
    return [...keys].find(key => key.textContent === symbol);
}
