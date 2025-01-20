export function activateKey(key, color) {
    key.style.backgroundColor = color;
}

export function deactivateKey(key, idleColor = 'rgba(47, 79, 79, 0.1)') {
    key.style.backgroundColor = idleColor;
}


export function changeButtonColor(key, color) {
    const button = document.querySelector(`.key[data-key="${key}"]`);
    if (button) {
        button.style.backgroundColor = color;
    }
}
