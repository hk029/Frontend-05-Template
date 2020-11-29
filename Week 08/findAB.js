// 基础方案
function findAB(str) {
    for (let i = 0; str[i]; i++) {
        const ch = str[i];
        const ch2 = str[i+1];
        if (ch === 'a' && ch2 === 'b') {
            return i;
        }
    }
    return -1;
}

// 老师优化方案, 用一个状态表示上次有没有找到a, 这样每次也只用判断当前字符
function findAB(str) {
    let findA = false;
    for (let i = 0; str[i]; i++) {
        const ch = str[i];
        if (ch === 'a') {
            findA = true;
        } else if (findA && ch === 'b'){
            return i;
        } else {
            findA = false;
        }
    }
    return -1;
}
