
/**
 * waitingLength
 * waitingLengthEnd
 * readingTrunk
 * waitingNewLine
 * waitingNewLineEnd
 * 
 */

class BodyParser {
    constructor() {
        this.length = 0;
        this.content = [];
        this.isFinished = false;
        this.state = this.waitingLength;
    }
    // 状态机
    recive(str) {
        this.state = this.state(str);
    }

    end = () => {
        this.state = this.waitingLength;
        return this.end;
    }

    // 这个状态读取所有的statusLine字符
    waitingLength = (ch) => {
        if(ch === '\r') {
            // 说明已经没有trunk了
            if(this.length === 0) {
                this.isFinished = true;
            }
            return this.waitingLengthEnd;
        }
        // 计算长度（十六进制）
        this.length *= 16;
        this.length += parseInt(ch, 16);
        // 重新回到自己的状态
        return this.waitingLength;
    }

    waitingLengthEnd = (ch) => {
        if(ch === '\n') {
            // 进入thrunk阶段
            return this.readingTrunk;
        }
        return this.wrongLength();
    }

    wrongLength = () => {
        console.error('wrong length');
        return this.end;
    }

    // 这个状态读取所有的数据, \r\n结束
    readingTrunk = (ch) => {
        this.content.push(ch);
        this.length--;
        if(this.length === 0) {
            return this.waitingNewLine;
        }
        return this.readingTrunk;
    }

    waitingNewLine = (ch) => {
        if(ch === '\r') {
            return this.waitingNewLineEnd;
        }
        return this.wrongNewLine();
    }

    waitingNewLineEnd = (ch) => {
        if(ch === '\n') {
            return this.waitingLength;
        }
        return this.wrongNewLine();
    }

    wrongNewLine = (ch) => {
        console.error('wrong newline');
        return this.end;
    }

    get result() {
        return this.content.join('');
    }
}

module.exports = BodyParser;
