const SYMBOL = {
    CROSS : 1,
    CIRCLE : 2,
};

const pattern = [
    [0, 1, 0],
    [0, 2, 0],
    [0, 0, 0],
];


const renderCell = cell => {
    const klass = 
    cell === SYMBOL.CROSS ? 'cross' : 
    cell === SYMBOL.CIRCLE ? 'circle' : '';
    return `<span class="cell ${klass}" ></span>`
}

const renderRow = row => {
    const cells = row.map(p => renderCell(p)).join('');
    return `<div class="row" >${cells}</div>`
}

const render = (root) => {
    const rows = pattern.map(row => renderRow(row)).join('');
    root.innerHTML = `
        <div class="pattern">
            ${rows}
        </div>
    `;
}

const main = () => {
    const root = document.querySelector('#root');
    render(root);
}

window.onload = () => {
    main();
}