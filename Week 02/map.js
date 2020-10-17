
let map = [];
let $ = (query) => {
    const _$ = document.querySelectorAll.bind(document);
    res = _$(query);
    if(res.length === 1) {
        return res[0];
    }
    return res;
}
// 设置画笔
let cursor = '';
let mouseDown = false;

const readMap = () => {
    let data = localStorage.getItem('map');
    return data ? JSON.parse(data) : new Array(10000).fill(0);
}

const writeMap = (map = new Array(10000).fill(0)) => localStorage.setItem('map', JSON.stringify(map));


const renderBlock = (isBlock) => {
    return `<span class="block ${isBlock ? 'black' : ''}"></span>`;
}

const restoreBlock = () => {
    let data = Array.from(document.querySelectorAll('.block')).map(t => t.classList.contains('black'))
    writeMap(data);
}

const reset = () => {
    // 用默认值重写数据
    writeMap();
    renderMap();
}

const changeCursor = type => () => {
    console.log($('.map'));
    $('.map').style.cursor = `url(./img/${type}.png), default`;
    cursor = type;
};

const addEvent = () => {
    // 按钮事件
    const $pen = $('#pen');
    const $eraser = $('#eraser');
    const $reset = $('#reset');
    $pen.onclick = changeCursor('pen');
    $eraser.onclick = changeCursor('eraser');
    $reset.onclick = reset;

    // 画图事件
    document.addEventListener('mousedown', () => {
        mouseDown = true;
    });
    document.addEventListener('mouseup', () => {
        mouseDown = false;
        console.log('up');
        restoreBlock();
    });
    document.addEventListener('mousemove', ev => {
        const target = ev.target;
        console.log('move', cursor, target);
        if (target.classList.contains('block') && mouseDown) {
            if (cursor === 'pen') {
                target.classList.add('black');
            }
            if (cursor === 'eraser') {
                target.classList.remove('black');
            }
        }
    })
}

const renderMap = () => {
    const root = $('#map');
    // 读取配置
    const data = readMap();
    root.innerHTML = `
<div class="map">
    ${data.map(renderBlock).join('')}
</div>`;
    return root;
}

const main = () => {
    window.onload = () => {
        renderMap();
        addEvent();
    }
}

main();