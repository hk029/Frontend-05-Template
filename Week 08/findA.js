function findA(str) {
    for (let i = str.length - 1;str[i];i--) {
        const ch = str[i];
        if (ch === 'a') {
            return i;
        }
    }
    return -1;
}