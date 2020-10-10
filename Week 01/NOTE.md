学习笔记


## let技巧
可以在代码中通过 `{}` 把代码强行分隔几块，在不同块中可以重复使用`let 声明赋值一些局部变量

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

## 交换两个值
用满交换律的任意运算（+-*/)
如果刚好是0，1也可以用取反运算

```js
 // 交换当前符号
 current = SYMBOL.CROSS + SYMBOL.CIRCLE - current;
 current = SYMBOL.CROSS * SYMBOL.CIRCLE / current;
```