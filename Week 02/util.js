/**
 * 暂停休眠函数
 * @param {*} time 休眠时间
 */
function sleep(time) {
    return new Promise((resolve) => {
        setTimeout(() => resolve(), time);
    })
}

/**
 * 通用dom查询方法
 * @param {*} query 
 */
let $ = (query) => {
    const _$ = document.querySelectorAll.bind(document);
    res = _$(query);
    if(res.length === 1) {
        return res[0];
    }
    return res;
}


window._ = {
    sleep,
    $,
}