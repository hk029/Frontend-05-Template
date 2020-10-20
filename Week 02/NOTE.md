# 学习笔记

## cursor可以自定义图片
```
.map .pen {
    cursor: url(./img/pen.png), default;
}
.map .eraser{
    cursor: url(./img/eraser.png), default;
}
```
## ** 乘方运算


## 寻路算法
### 广度有限
广度优先搜索算法（Breadth-First Search，BFS）是一种盲目搜寻法，目的是系统地展开并检查图中的所有节点，以找寻结果。换句话说，它并不考虑结果的可能位置，彻底地搜索整张图，直到找到结果为止。BFS并不使用经验法则算法。

广度优先搜索让你能够找出两样东西之间的最短距离

使用的数据结构：队列

```
enqueue(start);
while(queue.length) {
    const point = dequeue();
    if (point === end) {
        return ...;
    }
    enqueue(point周围点)
}
```

### 启发式算法
  
A* ：每次距离最终点近的进行扩展（依赖一个排序数结构）

### 排序数结构

参考[sorted.js](./sorted.js);