
const findPath = async (map, start, end) => {
    // 计算对应一维数组的位置
    let pre = end;
    const path = [];
    // 找前驱
    do {
        path.push(pre);
        // 拿到前一个pre
        const idx = pre[0] * 100 + pre[1];
        pre = map[idx] 
        await sleep(10);
        Array.from(_.$('.block'))[idx].style.backgroundColor = 'red';
    } while(pre[0] !== start[0] || pre[1] !== start[1]);
    return path;
}


const distance = (a, b) => (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2;

/**
 * 广度搜索，寻路算法
 * @param {Array} map 
 * @param {Point} start 
 * @param {Point} end 
 */
 const path = async (map, start, end) => {
    const queue = new BinHeapSorted([start], (a, b) => distance(a, end) - distance(b, end));

    const insertPoint = async ([x, y, pre]) => {
        // 边界条件处理
        if(x < 0 || x >= 100 || y < 0 || y >= 100) {
            return ;
        }
        // 计算对应一维数组的位置
        const idx = x * 100 + y;
        // 如果当前点被block
        if (map[idx]) {
            return false;
        }
        map[idx] = pre;
        await _.sleep(1);
        Array.from(_.$('.block'))[idx].style.backgroundColor = 'green';
        // 把当前点还有包含当前点的路径入队列
        queue.give([x, y]);
    }

    while(queue.length) {
        const [x, y] = queue.take();
        // 说明找到了，把整个路径输出
        if(x === end[0] && y === end[1]) {
            let path = await findPath(map, start, end);
            console.log(path);
            return path;
        }
        // 插入周围节点
        await insertPoint([x+1, y, [x, y]]);
        await insertPoint([x-1, y, [x, y]]);
        await insertPoint([x, y+1, [x, y]]);
        await insertPoint([x, y-1, [x, y]]);

        await insertPoint([x+1, y+1, [x, y]]);
        await insertPoint([x+1, y-1, [x, y]]);
        await insertPoint([x-1, y-1, [x, y]]);
        await insertPoint([x-1, y+1, [x, y]]);
    }
    // 说明没找到
    return false;
}

window.path = path;