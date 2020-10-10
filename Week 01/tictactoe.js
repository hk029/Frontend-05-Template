const C = {
    EMPTY: 0,
    CROSS: 1,
    CIRCLE: 2,
    PEACE: 0,
    WIN: 1,
    LOSE: -1
};

const CLASS_MAP = {
    0: 'empty',
    1: 'cross',
    2: 'circle',
};

const PATTERN = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
];

// 设置用户走的类型
let user = C.CIRCLE;

// 当前走的类型
let current = C.CIRCLE;


/**
 * 交换落子
 */
const exchange = (color) => C.CROSS + C.CIRCLE - color;

/**
 * 克隆方法
 * @param {*} v 
 */
const clone = v => JSON.parse(JSON.stringify(v));


////////////////////////////////
//
//           游戏策略
//
////////////////////////////////


/**
 * 判断数组中的坐标是否是当前落子
 * @param {*} pattern 
 * @param {*} color 
 * @return {Function} Array => Boolean
 */
const equalCurrent = (pattern, color) => arr => arr.every(([x, y]) => pattern[x][y] === color);

/**
 * 判断是否有人获胜
 */
const isWin = (pattern, color) => {
    const equal = equalCurrent(pattern, color);
    // 判断每行
    for (let i = 0; i < 3; i++) {
        if (equal([[i, 0], [i, 1], [i, 2]])) {
            return true;
        }
    }
    // 判断每列
    for (let j = 0; j < 3; j++) {
        if (equal([[0, j], [1, j], [2, j]])) {
            return true;
        }
    }
    // 判断角线
    if (equal([[0, 0], [1, 1], [2, 2]])) {
        return true;
    }
    if (equal([[0, 2], [1, 1], [2, 0]])) {
        return true;
    }
    return false;
}

/**
 * 检查当前棋盘内是否有可以取胜的位置
 */
const willWin = (pattern, color) => {

    let win = null;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            const cell = pattern[i][j];
            // 如果可以落子则尝试落子
            if (cell === 0) {
                // 复制一个棋盘，尝试落子
                const newPattern = clone(pattern);
                newPattern[i][j] = color;
                if (isWin(newPattern, color)) return [i, j];
            }
        }
    }
    return win;
}

/**
 * 判断当前是否有最佳策略：
 * - 我能赢
 * - 我不会输
 * @param {*} pattern 
 * @param {*} color 
 * @return {Object} {point, result} result: -1输 0和 1赢 （用对称值来表示输赢，可以通过 - 进行切换
 */
const bestChoice = (pattern, color) => {
    // 选-2表示一个不可能取到的最小值
    let point, result = -2;
    if (point = willWin(pattern, color)) {
        return {
            point,
            result: C.WIN
        }
    }
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (pattern[i][j]) continue;
            let newPattern = clone(pattern);
            // 把当前位置落子后，看对方的最好策略是什么
            newPattern[i][j] = color;
            let { result: r } = bestChoice(newPattern, exchange(color));
            // 对方赢说明我们输，对方输说明我们赢
            if (-r > result) {
                result = -r;
                point = [i, j]
            }
        }
    }
    return {
        point,
        // 如果point不存在说明已经无点可以走了，返回0
        result: point ? result : C.PEACE
    }


}

////////////////////////////////
//
//           渲染相关
//
////////////////////////////////

/**
 * 渲染一个格子
 * @param {*} cell 
 * @param {*} i 
 * @param {*} j 
 */
const renderCell = (cell, i, j) => {
    const klass =
        cell === C.CROSS ? 'cross' :
            cell === C.CIRCLE ? 'circle' : '';
    // 通过class变更落子的文字，通过data-poin记录对应的数据位置
    return `<span class="cell ${klass}" data-point="${i}-${j}"></span>`
}

/**
 * 渲染一行
 * @param {*} row 
 * @param {*} rowIdx 
 */
const renderRow = (row, rowIdx) => {
    const cells = row.map((p, idx) => renderCell(p, rowIdx, idx)).join('');
    return `<div class="row" >${cells}</div>`
}

/**
 * 在root结点上渲染棋盘
 * @param {*} root 
 */
const render = (root) => {
    const rows = PATTERN.map((row, idx) => renderRow(row, idx)).join('');
    root.innerHTML = `
        <div class="pattern">
            ${rows}
        </div>
    `;
}

/**
 * 修改当前格子的颜色
 * @param {*} cell 
 */
const toggleClass = (cell) => {
    // 说明当前已经有落子了
    if (cell.classList.length > 1) {
        return false;
    }
    cell.classList.add(CLASS_MAP[current]);
    return true;
}



////////////////////////////////
//
//           事件相关 
//
////////////////////////////////

/**
 * 移动子
 * @param {*} target
 */
const move = (target) => {
    // 获取当前点击的坐标
    const { dataset: { point } } = target;
    // 把当前的区域设置成对应的落子符号
    // 通过添加class可以完成换字，避免重新渲染
    const [x, y] = point.split('-')
    if (toggleClass(target)) {
        PATTERN[x][y] = current;
        if (isWin(PATTERN, current)) {
            alert(`${CLASS_MAP[current]}赢了`)
            removeEvent();
            return;
        }
        // 交换落子
        current = exchange(current);
        // 判交换后是否可以胜利
        if (willWin(PATTERN, current)) {
            console.log(`${CLASS_MAP[current]}将要赢了`)
        }
        // 如果当前走的不是用户，则自动落子
        if (current !== user) {
            autoMove(PATTERN, current);
        }
    }
}
/**
 * 自动走子
 * @param {*} ev 
 */

const autoMove = (pattern, color) => {
    const { point } = bestChoice(pattern, color);
    if (point) {
        const [i, j] = point;
        const target = [].slice.call(document.querySelectorAll('[data-point]')).find(v => v.dataset.point === `${i}-${j}`);
        move(target);
    }
}

const userMove = (ev) => {
    const { target } = ev;
    // 说明点击的是cell
    if (target.dataset.point) {
        move(target);
    }
}


const addEvent = () => window.addEventListener('click', userMove);

const removeEvent = () => window.removeEventListener('click', userMove);



const main = () => {
    const root = document.querySelector('#root');
    render(root);
    addEvent(root);
}

window.onload = () => {
    main();
}