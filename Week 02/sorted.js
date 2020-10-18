class Sorted {
    constructor(arr, compare) {
        this.compare = compare || ((a, b) => a - b);
        this.data = [...arr].sort(this.compare);
    }

    take() {
        if(!this.data.length) {
            return ;
        }
        return this.data.shift();
    }

    give(v) {
        this.data.push(v);
        this.data.sort(this.compare);
        return v;
    }

    length() {
        this.data.length;
    }
}



/**
 * 最小堆：父元素的值小于所有孩子的值
 * 二叉堆：用一棵完全二叉树表示的最小堆
 */

 // 私有属性
const parent = Symbol('parent');
const leftChild = Symbol('leftChild');
const rightChild = Symbol('rightChild');
const swap = Symbol('swap');
const rebuildHeap = Symbol('rebuildHeap');
const heapify = Symbol('heapify');

class BinHeapSorted {
    constructor(arr, compare) {
        this.compare = compare || ((a, b) => a - b);
        this.data = [...arr];
        this.len = arr.length;
        this[rebuildHeap]();
    }

    [parent](i) {
        return (i - 1) / 2;
    }

    [leftChild](i) {
        return 2 * i + 1;
    }

    [rightChild](i) {
        return 2 * i + 2;
    }

    [swap](i, j) {
        const temp = this.data[i];
        this.data[i] = this.data[j];
        this.data[j] = temp;
    }

    /**
     *  重构堆：从倒数第二层开始逐步的向上合并（最后一层是叶子）
     * @param {*} i 
     * @param {*} j 
     */
    [rebuildHeap]() {
        const middle = Math.floor(this.length / 2);
        for (let i = middle - 1; i >= 0; i--) {
            this[heapify](i);
        }
    }

    /**
     * 从i位置开始向下递归构建小顶堆
     * @param {*} i 
     */
    [heapify](i) {
        let right = this[rightChild](i);
        let left = this[leftChild](i);
        let small = i;
        // 如果左右节点更小
        if(left < this.length && this.compare(this.data[left], this.data[small]) < 0)
            small = left;
        if(right < this.length && this.compare(this.data[right], this.data[small]) < 0)
            small = right;
        if(small !== i){
            this[swap](i, small);
            // 递归调用
            this[heapify](small);
        }
    }

   /**
    * 获取元素O(1)
    */
   take() {
        if(!this.data.length) {
            return ;
        }
        if(this.length === 1) {
            this.len = 0;
            return this.data[0];
        }
        // 把最后一个元素跟0号交换，然后重新执行堆化
        const val = this.data[0];
        this.data[0] = this.data[this.length - 1];
        this.len--;
        this[heapify](0);
        return val; 
    }

   /**
    * 放入元素O(logN)
    */
    give(v) {
        // 最后的元素不一定真的被删除，所以不能用push
        this.data[this.length] = v;
        this.len++;
        // 重构一下大顶堆 O(logN)
        this[rebuildHeap]();
        return v;
    }

    get length() {
        return this.len;
    }
}

window.Sorted = Sorted;
window.BinHeapSorted = BinHeapSorted;