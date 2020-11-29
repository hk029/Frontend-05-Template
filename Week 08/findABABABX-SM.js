// 状态机
// 把每个函数当做一个状态（js中函数是一等公民，可以赋值或当参数）
// 最后只用判断当前状态（函数）是哪一个就行了
function end() {
    return end;
}

function start(c) {
    if(c === 'a') {
        return findA;
    }
    // 这里不能使用reconsume了，否则死循环了，当前值就是要被吞掉，到下一个值
    return start;
}

const findX = (x, nextState) => c => {
    if(c === x) {
        return nextState;
    }
    // reConsume，防止当前字符被吃掉
    return start(c)
}

const findB3 = findX('x', end);

const findA3 = findX('b', findB3);

const findB2 = findX('a', findA3);

const findA2 = findX('b', findB2);

const findB = findX('a', findA2);

const findA = findX('b', findB);

function match(str) {
    let state = start;
    for(let ch of str) {
        state = state(ch);
    }
    return state === end;
}
