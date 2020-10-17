学习笔记


## let技巧
可以在代码中通过 `{}` 把代码强行分隔几块，在不同块中可以重复使用`let 声明赋值一些局部变量,方便对代进行分块管理和复制
```js
{
    let a = 0;
    ...
}
{
    let a = 0;
    ...
}
```

## 粗暴clone
```js
 const clone = v => JSON.parse(JSON.stringify(v));
```

## 一个通用的等待事件触发函数

```js
const happen = (element, event) => {
    return new Promise((resolve) => {
        // 通过设置once，保证事件只执行一次
        element.addEventListener(event, resolve, {once: true});
    })
}
```

## 异步处理
在异步处理中经常会用while(true)表示一些永久执行的程序

### generator模拟await
```js

function sleep(time) {
    return new Promise((resolve, reject) => {
        setTimeout(() => resolve(), time);
    })
}

function* go() {
    yield sleep(1000);
    console.log("red");
    yield sleep(2000);
    console.log("yellow");
    yield sleep(3000);
    console.log("green");
}


const run = () => {
    const {done} = 
    if()

}

const co = () => {

}


```

### async generator
```js
function sleep(time) {
    return new Promise((resolve, reject) => {
        setTimeout(() => resolve(), time);
    })
}

async function* counter() {
    let i = 0;
    while(true) {
        await sleep(1000);
        yield i++;
    }
}

(async function(){
    for await (let v of counter()) {
        console.log(v);
    }
})()

```

## 交换两个值
用满交换律的任意运算（+-*/)
如果刚好是0，1也可以用取反运算

```js
 // 交换当前符号
 current = SYMBOL.CROSS + SYMBOL.CIRCLE - current;
 current = SYMBOL.CROSS * SYMBOL.CIRCLE / current;
```