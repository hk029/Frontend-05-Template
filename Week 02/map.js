
let map = [];
// 设置画笔
let cursor = '';
let mouseDown = false;

//----------------------------------------------------------------
//        工具函数相关
//----------------------------------------------------------------

/**
 * 更改当前鼠标类型
 * @param {*} type 
 */
const changeCursor = type => () => {
    console.log(_.$('.map'));
    _.$('.map').style.cursor = `url(https://img.hksite.cn/${type}.png), default`;
    cursor = type;
};


//----------------------------------------------------------------
//        数据相关
//----------------------------------------------------------------

/**
 * 读取地图数据
 */
const readMap = () => {
    let data = localStorage.getItem('map');
    map = data ? JSON.parse(data) : new Array(10000).fill(0);
    return map;
}

/**
 * 写入地图数据
 * @param {*} map 
 */
const writeMap = (map = new Array(10000).fill(0)) => localStorage.setItem('map', JSON.stringify(map));

/**
 * 保存当前数据
 */
const restoreBlock = () => {
    let data = Array.from(document.querySelectorAll('.block')).map(t => t.classList.contains('black'))
    writeMap(data);
}

/**
 * 重置当前数据
 */
const reset = () => {
    // 用默认值重写数据
    writeMap();
    renderMap();
}


//----------------------------------------------------------------
//        事件相关
//----------------------------------------------------------------

/**
 * 事件绑定
 */
const addEvent = () => {
    // 按钮事件
    const $pen = _.$('#pen');
    const $eraser = _.$('#eraser');
    const $reset = _.$('#reset');
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

//----------------------------------------------------------------
//         渲染相关
//----------------------------------------------------------------

/**
 * 渲染一个格子
 * @param {Boolean} isBlock 
 */
const renderBlock = (isBlock) => {
    return `<span class="block ${isBlock ? 'black' : ''}"></span>`;
}

/**
 * 渲染地图
 */
const renderMap = () => {
    const root = _.$('#map');
    // 读取配置
    const data = readMap();
    root.innerHTML = `
<div class="map">
    ${data.map(renderBlock).join('')}
</div>`;
    return root;
}

/**
 * 主流程
 */
const main = () => {
    window.onload = () => {
        renderMap();
        addEvent();
    }
}

window.map = map;
main();