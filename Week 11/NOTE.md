# 学习笔记
## 为什么 first-letter 可以设置 float 之类的，而 first-line 不行呢？

个人理解：first-letter 的内容是确定的，不会以为布局变化而产生变化。
但是 first-line 的content则是需要计算的，任何样式布局上的变化，都可能导致content的取值发生变化。


## 爬虫

在一个同域的页面上开启一个iframe就可以构建一个小型爬虫，不需要考虑跨域问题

## match

我理解match的关键是selector的分析，所以重点放在了构建selecotrSM上
```js
/**
 * 整个文件的关键就是这个状态机，拿到所有的selector组，并给出他们的关系
 * @param {*} selector 
 */
function selectorSM(selector) {
    const last = arr => arr[arr.length - 1];
    const EOF = Symbol('EOF');
    const groups = [];
    let id = '', klass = '', attr = '', type = '';

    function groupStart(ch) {
        if(ch === EOF) {
            return end(ch);
        }
        // 理论上开头不能有这些符号，所以默认group只有有一个元素了
        if(ch === ' ') {
            last(groups).type = 'ancestors';
        }
        if(ch === '>') {
            last(groups).type = 'parent';
        }
        if(/^\+~$/.test(ch)) {
            last(groups).type = 'slibing';
        }
        return typeStart;
    }

    function groupEnd(ch) {
        groups.push({type: 'ancestors', data: {id, klass, attr, type}});
        currentType = '';
        id = '';
        klass = '';
        attr = '';
        type = '';
        return groupStart(ch);
    }

    function typeStart(ch) {
        if(ch === EOF) {
            return end(ch);
        }
        if(/^[\s>\+~]$/.test(ch)) {
            return groupEnd(ch);
        }
        if(ch === '[') {
            return attrStart;
        }
        if(ch === '.') {
            return classStart;
        }
        if(ch === '#') {
            return idStart;
        }
        type += ch;
        return typeStart;
    }

    function end() {
        if(id || type || attr || klass) {
            groupEnd(EOF);
        }
        return end;
    }

    function attrStart(ch) {
        if(ch === EOF) {
            return end(ch);
        }
        if(ch === ']') {
            return attrEnd;
        }
        attr += ch;
        return attrStart;
    }
    
    function attrEnd(ch) {
         if(ch === EOF) {
            return end(EOF);
        }
        attr = attr.split('=');
        return typeStart(ch);
    }

    function classStart(ch) {
         if(ch === EOF) {
            return end(EOF);
        }
        if(/^[\w_-]$/.test(ch)) {
            klass += ch;
            return classStart;
        }
        return typeStart(ch);
    }

    function idStart(ch) {
         if(ch === EOF) {
            return end(EOF)
        }
        if(/^[\w_-]$/.test(ch)) {
            id += ch;
            return idStart;
        }
        return typeStart(ch);
    }

    let state = typeStart;
    for (ch of selector) {
        state = state(ch);
    }
    state = state(EOF);
    return groups;
}

```

## 思维导图

![](./css.png)