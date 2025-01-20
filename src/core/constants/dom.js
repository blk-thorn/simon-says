export const DOM= {
    display: null,
    keyboard: null,
    body: document.body,
    buttons: {
        easy: null,
        medium: null,
        hard: null,
        next: null,
        repeat: null,
        new: null,
        start: null
    }
};

export function initDOM() {
    DOM.body.className = 'body';
    DOM.display = document.getElementById('display');
    DOM.keyboard = document.getElementById('keyboard');
    DOM.buttons.easy = document.getElementById('easy');
    DOM.buttons.medium = document.getElementById('medium');
    DOM.buttons.hard = document.getElementById('hard');
    DOM.buttons.next = document.getElementById('next');
    DOM.buttons.repeat = document.getElementById('repeat');
    DOM.buttons.new = document.getElementById('new');
    DOM.buttons.start = document.getElementById('start');
}
