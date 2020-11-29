// 不用状态机
function findABCDEF(str) {
    let lastFind = '';
    for (let i = 0; str[i]; i++) {
        const ch = str[i];
        // 必须按顺序依次判断，因为abcef是一个字符串
        if (ch === 'a') {
            lastFind = 'a';
        } else if (lastFind === 'a' && ch === 'b'){
            lastFind = 'b';
        } else if (lastFind === 'b' && ch === 'c'){
            lastFind = 'c';
        } else if (lastFind === 'c' && ch === 'd'){
            lastFind = 'd';
        } else if (lastFind === 'd' && ch === 'e'){
            lastFind = 'e';
        } else if (lastFind === 'e' && ch === 'f'){
            return i;
        } else {
            lastFind = ''
        }
    }
    return -1;
}




// 状态机
function end() {
    return end;
}

function start(c) {
    if(c === 'a') {
        return findA(c);
    }
    // reConsume
    return start(c)
}

const findX = (x, nextState) => c => {
    if(c === x) {
        return nextState(c);
    }
    // reConsume
    return start(c)
}

const findA = findX('a', findB);

const findB = findX('b', findC);

const findC = findX('c', findD);

const findD = findX('d', findE);

const findE = findX('e', end);

function match(str) {
    let state = start;
    for(let ch of str) {
        state = state(ch);
    }
    return state === end;
}
