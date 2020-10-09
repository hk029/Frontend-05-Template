const SYMBOL = {
    EMPTY: 0,
    CROSS: 1,
    CIRCLE: 2,
};

const pattern = [
    [0, 1, 0],
    [0, 2, 0],
    [0, 0, 0],
];

let current = SYMBOL.CROSS;

const renderCell = (cell, i, j) => {
    const klass =
        cell === SYMBOL.CROSS ? 'cross' :
            cell === SYMBOL.CIRCLE ? 'circle' : '';
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

const addEvent = (root) => {
    window.addEventListener('click', (ev) => {
        const { target } = ev;
        // 说明点击的是cell
        if (target.dataset.point) {
            // 获取当前点击的坐标
            const { dataset: { point } } = target;
            const [x, y] = point.split('-')
            // 把当前的区域设置成对应的落子符号
            if(pattern[x][y] === SYMBOL.EMPTY) {
                pattern[x][y] = current;
                // 交换当前符号
                current = SYMBOL.CROSS + SYMBOL.CIRCLE - current;
            }
            // 重新渲染
            render(root);
        }
    })
}


const main = () => {
    const root = document.querySelector('#root');
    render(root);
    addEvent(root);

}

window.onload = () => {
    main();
}