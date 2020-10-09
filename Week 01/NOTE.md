学习笔记


## 交换两个值
用满交换律的任意运算（+-*/)
如果刚好是0，1也可以用取反运算

```js
 // 交换当前符号
 current = SYMBOL.CROSS + SYMBOL.CIRCLE - current;
 current = SYMBOL.CROSS * SYMBOL.CIRCLE / current;
```