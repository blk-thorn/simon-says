export function generateSequence(symbols, length) {
    return Array.from({ length }, () =>
        symbols[Math.floor(Math.random() * symbols.length)]
    );
}
