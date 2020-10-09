const SYMBOL = {
    EMPTY: 0,
    CROSS: 1,
    CIRCLE: 2,
};

const CLASS_MAP = {
    0: 'empty',
    1: 'cross',
    2: 'circle',
};

const pattern = [
    [0, 1, 0],
    [0, 2, 0],
    [0, 0, 0],
];

let current = SYMBOL.CROSS;

/**
* 判断数组中的坐标是否是当前落子
* @param {*} arr 
*/
const equalCurrent = (arr) => arr.every(([x, y]) => pattern[x][y] === current);

/**
 * 判断是否有人获胜
 */
const isWin = () => {

    // 判断每行
    for (let i = 0; i < 3; i++) {
        if (equalCurrent([[i, 0], [i, 1], [i, 2]])) {
            return true;
        }
    }
    // 判断每列
    for (let j = 0; j < 3; j++) {
        if (equalCurrent([[0, j], [1, j], [2, j]])) {
            return true;
        }
    }
    // 判断角线
    if (equalCurrent([[0, 0], [1, 1], [2, 2]])) {
        return true;
    }
    if (equalCurrent([[0, 2], [1, 1], [2, 0]])) {
        return true;
    }
    return false;
}

const renderCell = (cell, i, j) => {
    const klass =
        cell === SYMBOL.CROSS ? 'cross' :
            cell === SYMBOL.CIRCLE ? 'circle' : '';
    // 通过class变更落子的文字，通过data-poin记录对应的数据位置
    return `<span class="cell ${klass}" data-point="${i}-${j}"></span>`
}

const renderRow = (row, rowIdx) => {
    const cells = row.map((p, idx) => renderCell(p, rowIdx, idx)).join('');
    return `<div class="row" >${cells}</div>`
}

const render = (root) => {
    const rows = pattern.map((row, idx) => renderRow(row, idx)).join('');
    root.innerHTML = `
        <div class="pattern">
            ${rows}
        </div>
    `;
}

const toggleClass = (cell) => {
    // 说明当前已经有落子了
    if (cell.classList.length > 1) {
        return false;
    }
    cell.classList.add(CLASS_MAP[current]);
    return true;
}

const exchange = () => (current = SYMBOL.CROSS + SYMBOL.CIRCLE - current);


/**
 * 移动子
 * @param {*} ev 
 */
const move = (ev) => {
    const { target } = ev;
    // 说明点击的是cell
    if (target.dataset.point) {
        // 获取当前点击的坐标
        const { dataset: { point } } = target;
        const [x, y] = point.split('-')
        // 把当前的区域设置成对应的落子符号
        // 通过添加class可以完成换字，避免重新渲染
        if (toggleClass(target)) {
            pattern[x][y] = current;
            if (isWin()) {
                alert(`${CLASS_MAP[current]}赢了`)
                removeEvent();
                return;
            }
            // 交换落子
            exchange();
        }
    }
}

const addEvent = () => window.addEventListener('click', move);

const removeEvent = () => window.removeEventListener('click', move);



const main = () => {
    const root = document.querySelector('#root');
    render(root);
    addEvent(root);
}

window.onload = () => {
    main();
}