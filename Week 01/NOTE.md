学习笔记


## let技巧
可以在代码中通过 `{}` 把代码强行分隔几块，在不同块中可以重复使用`let 声明赋值一些局部变量

## 粗暴clone
```js
 const clone = v => JSON.parse(JSON.stringify(v));
```

## 交换两个值
用满交换律的任意运算（+-*/)
如果刚好是0，1也可以用取反运算

```js
 // 交换当前符号
 current = SYMBOL.CROSS + SYMBOL.CIRCLE - current;
 current = SYMBOL.CROSS * SYMBOL.CIRCLE / current;
```