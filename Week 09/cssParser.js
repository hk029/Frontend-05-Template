const css = require('css');
const EOF = Symbol('EOF');

const matchSpace = ch => ch.match(/^[\t\n\f ]$/);
const matchCharacter = ch => ch.match(/^[a-zA-Z]$/);
const last = v => Array.isArray(v) ? v[v.length - 1] : undefined;

class BodyParser {
    constructor() {
        this.el_stack = [
            { type: 'document', children: [] }
        ];
        this.rules = [];
        this.currentTextNode = null;
        this.currentToken = null;
        this.state = this.data;
    }

    addCssRules = (text) => {
        const ast = css.parse(text);
        rules.push(...ast.stylesheet.rules);
    }

    match = (element, selector) => {
        if (!selector || !element.attributes) {
            return false;
        }
        if(selector.charAt(0) === '#') {
            const attr = element.attributes.filter(a => a.name === 'id')[0];
            if(attr && attr.value === selector.replace('#', '')) {
                return  true;
            }
        } else if(selector.charAt(0) === '.') {
            const attr = element.attributes.filter(a => a.name === 'class')[0];
            if(attr && attr.value === selector.replace('.', '')) {
                return  true;
            }
        } else {
            if(element.tagName === selector) {
                return true;
            }
        }
    }

    specificity = (selector) => {
        let p = [0, 0, 0, 0];
        let selectorParts = selector.split(' ');
        for (let part of selectorParts) {
            if(part.charAt(0) === '#') {
                p[1] += 1;
            } else if(part.charAt(0) === '.') {
                p[2] += 1;
            } else {
                p[3] += 1;
            }
        }
        return p;
    }

    compare(a, b) {
        if(a[0] - b[0]) {
            return a[0] - b[0];
        }
        if(a[1] - b[1]) {
            return a[1] - b[1];
        }
        if(a[2] - b[2]) {
            return a[2] - b[2];
        }
        return a[3] - b[3];
    }

    computeCss = element => {
        const elements = this.el_stack.slice().reverse();
        if(!element.computedStyle) {
            element.computedStyle = {}
        }
        for(let rule of this.rules) {
            let selectorParts = rule.selectors[0].split(' ').reverse();
            if(!this.match(element, selectorParts[0])) {
                continue;
            }
            let j = 1, matched = false;
            for(let i = 0; i < elements.length; i++) {
                if(this.match(elements[i], selectorParts[j])) {
                    j++;
                }
            }
            if(j >= selectorParts.length) {
                matched = true;
            }
            if(matched) {
                let sp = this.specificity(rule.selectors[0]);
                let computedStyle = element.computedStyle;
                for(let declaration of rule.declarations) {
                    if(!computedStyle[declaration.property]) {
                        computedStyle[declaration.property] = {}
                    }
                    if(!computedStyle[declaration.property].specificity) {
                        computedStyle[declaration.property].value = declaration.value;
                        computedStyle[declaration.property].specificity = sp;
                    } else if (this.compare(computedStyle[declaration.property].specificity, sp) < 0) {
                        computedStyle[declaration.property].value = declaration.value;
                        computedStyle[declaration.property].specificity = sp;
                    }
                }
            }

        }
    }
 
    emit = (token) => {
        console.log(token);
        let top = last(this.el_stack);
        // 开始标签，入栈操作
        if (token.type === 'startTag') {
            let el = {
                type: 'element',
                children: [],
                attributes: []
            };

            el.tagName = token.tagName;

            // 把toke中除了type和tagName的字段都塞到attribues中
            for (let p in token) {
                if (p !== 'type' || p != 'tagName') {
                    el.attributes.push({
                        name: p,
                        value: token[p]
                    });
                }
            }

            // 计算css
            this.computeCss(el);

            top.children.push(el);

            // 如果是自闭合，直接出栈
            if (!top.isSelfClosing) {
                stack.push(el);
            }

            this.currentTextNode = null;
        }
        // endTag做出栈操作
        if (token.type === 'endTag') {
            if (top.tagName !== token.tagName) {
                throw new Error('no match tagName');
            }
            stack.pop();
            this.currentTextNode = null;
        }
        // text节点
        if (token.type === 'text') {
            if (this.currentTextNode === null) {
                this.currentTextNode = {
                    type: 'text',
                    content: ''
                };
                top.children.push(currentTextNode);
            }
            this.currentTextNode.content += token.content
        }
    }
    // 状态机
     recive(str) {
        let state = this.data;
        for(let ch of str) {
            state = state(ch);
        }
        state = state(EOF);
        return this.el_stack;
    }
    // 状态机
    data = (ch) => {
        if (ch === '<') {
            return this.tagOpen;
        } else if (ch === EOF) {
            this.emit({
                type: 'EOF'
            });
            return;
        } else {
            this.emit({
                type: 'text',
                content: ch
            });
            return this.data;
        }
    }

    end = () => {
        this.state = this.data;
        return this.end;
    }

    // 这个状态读取所有的statusLine字符
    tagOpen = (ch) => {
        if (ch === '/') {
            // 说明是闭合标签
            return this.endTagOpen;
        }
        // 如果是正常的字母
        if (matchCharacter(ch)) {
            this.currentToken = {
                type: 'startTag',
                tagName: ''
            }
            return this.tagName(ch);
        }
        this.emit({
            type: 'text',
            content: ch
        });
        return this.end;
    }

    tagName = (ch) => {
        if (matchSpace(ch)) {
            // 如果匹配到空白字符，说明tagName结束了
            return this.beforAttributesName;
        }
        if (ch === '/') {
            // 说明是自闭合标签
            return this.selfClosingStartTag;
        }
        if (ch === '>') {
            // 说明匹配完成，返回data开始重新匹配
            this.emit(this.currentToken);
            return data;
        }
        this.currentToken.tagName += ch.toLowerCase();
        return this.tagName;
    }

    beforAttributesName = (ch) => {
        if (matchSpace(ch)) {
            // 读掉过多的空白字符
            return this.beforAttributesName;
        }
        if (ch === '/' || ch === '>' || ch === EOF) {
            return this.afterAttributeName(ch);
        }
        if (ch === '=') {

        }
        this.currentAttribute = {
            name: '',
            value: ''
        };
        return this.attributeName(ch);
    }

    attributeName = (ch) => {
        if (matchSpace(ch) || ch === '/' || ch === '>' || ch === EOF) {
            return this.afterAttributeName(ch);
        }
        if (ch === '=') {
            return this.beforAttributesName;
        }
        if (ch === '\u0000') {

        }
        // 说明匹配到引号
        if (ch === '"' || ch === "'" || ch === '<') {

        } else {
            this.currentAttribute.name += ch;
            return this.attributeName;
        }
    }

    beforAttributeValue = (ch) => {
        if (matchSpace(ch) || ch === '/' || ch === '>' || ch === EOF) {
            // 读掉过多的空白字符
            return this.beforAttributeValue;
        }
        if (ch === "'") {
            return this.singleQuoteAttributeValue;
        }
        if (ch === '"') {
            return this.doubleQuoteAttributeValue;
        }
        if (ch === '<') {
            return this.data;
        } else {
            return this.unQuoteAttributeValue;
        }
    }

    singleQuoteAttributeValue = (ch) => {
        if (ch === "'") {
            this.currentToken[this.currentArrtibut.name] = this.currentArrtibu.value;
            return afterQuoteAttributeValue;
        }
        if (ch === '\u0000') {
        }
        if (ch === EOF) {

        }
        this.currentAttribute.value += ch;
        return this.doubleQuoteAttributeValue;
    }

    doubleQuoteAttributeValue = (ch) => {
        if (ch === '"') {
            this.currentToken[this.currentArrtibut.name] = this.currentArrtibu.value;
            return afterQuoteAttributeValue;
        }
        if (ch === '\u0000') {
        }
        if (ch === EOF) {

        }
        this.currentAttribute.value += ch;
        return this.doubleQuoteAttributeValue;
    }

    unQuoteAttributeValue = (ch) => {
        if (matchSpace(ch)) {
            this.currentToken[this.currentArrtibut.name] = this.currentArrtibu.value;
            return beforAttributesName;
        }
        if (ch === '/') {
            this.currentToken[this.currentArrtibut.name] = this.currentArrtibu.value;
            return this.selfClosingStartTag;
        }
        if (ch === '>') {
            this.currentToken[this.currentArrtibut.name] = this.currentArrtibu.value;
            this.emit(this.currentToken);
            return this.data;
        }
        if (ch === '\u0000') {
        }
        if (ch === '"' || ch === "'" || ch === '<' || ch === '=' || ch === '`') {
        }
        if (ch === EOF) {

        }
        this.currentAttribute.value += ch;
        return this.unQuoteAttributeValue;
    }

    afterQuoteAttributeValue = (ch) => {
        if(matchSpace(ch)) {
            return this.beforAttributesName;
        }
        if(ch === '/') {
            return this.selfClosingStartTag;
        }
        if(ch === '>') {
            this.currentToken[this.currentArrtibut.name] = this.currentArrtibu.value;
            this.emit(this.currentToken);
            return this.data;
        }
        if (ch === EOF) {

        }
        this.currentAttribute.value += ch;
        return this.doubleQuoteAttributeValue;
        ;
    }

    selfClosingStartTag = (ch) => {
        if (ch === '>') {
            this.currentToken.isSelfClosing = true;
            this.emit(this.curtoken);
            return data;
        }
        if (ch === EOF) {

        }
    }

    endTagOpen = (ch) => {
        if (matchCharacter(ch)) {
            this.currentToken = {
                tyep: 'endTag',
                tagName: ''
            }
        }
        return tagName(ch);
    }

    afterAttributeName = (ch) => {
        if (matchSpace(ch)) {
            return this.afterAttributeName;
        }
        if (ch === '/') {
            return this.selfClosingStartTag;
        }
        if (ch === '=') {
            return this.beforAttributeValue;
        }
        if (ch === '>') {
            this.currentToken[this.currentAttribute.name] = this.currentArrtibut.value;
            this.emit(this.currentToken);
            return data;
        }
            this.currentToken[this.currentAttribute.name] = this.currentArrtibut.value;
            this.currentAttribute = {
                name: '',
                value: ''
            }
            return this.attributeName(ch);
    }

    get result() {
        return this.el_stack;
    }
}

module.exports = BodyParser;