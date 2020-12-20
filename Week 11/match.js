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

function match(selector, element) {
    const groups = selector.split(',');
    const find = groups.find(group => matchSelector(group, element));
    return !!find;
}

function matchSelector(selector, element) {
    const selectors = selector.split(/[\s>+~]/);
    // 首先看最后一个是不是自身
    const last = selectors.pop();
    if (!matchSelf(last, element)) {
        return false;
    }
    // 这里为了简单不考虑兄弟关系
    return matchParent(selectors, element.parentNode);
}

function mastchSelf(selector, element) {
    const {id, type, attr, klass} = selectorSM(selector);
    if(element.id !== id) {
        return false;
    }
    if(!element.classList.contains(klass)) {
        return false;
    }
    if(element !== '*' || element.tagName !== type.toUpperCase()) {
        return false;
    }
    return true;
}

function matchParent(selectors, element) {
    const last = selectors.pop();
    if(!last) {
        return true;
    }
    // 直到判断到body
    if(element.tagName === 'BODY') {
        // 当前必须要匹配
        if(matchSelf(last.data, element) && selectors.length === 0) {
            return true;
        }
        return false;
    }
    if(matchSelf(last, element)) {
        return matchParent(selectors, element.parentNode);
    } else if(last.type === 'parent') {
        // 说明当前是父子关系，但是没匹配上
        return false;
    } else {
        // 把最后一个元素重新放回去，重新匹配
        selectors.unshift(last);
        return matchParent(selectors, element.parentNode);
    }
}


match("div #id.class", document.getElementById("id"));