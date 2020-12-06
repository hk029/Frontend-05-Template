
/**
 * waitingStatusLine
 * waitingStatusLineEnd
 * waitingHeaderName
 * waitingHeaderSpace
 * waitingHeaderValue
 * waitingHeaderLineEnd
 * waitingHeaderBlockEnd
 * waitingBody
 * 
 */
const BodyParser = require('./bodyParser');

class ResponseParser {
    constructor() {
        this.statusLine = '';
        this.headers = {};
        this.bodyText = '';
        this.body = {};
        this.bodyParser = null;
        this.bodyState = null;
    }
    // 状态机
    recive(str) {
        let state = this.waitingStatusLine;
        for(let ch of str) {
            state = state(ch);
        }
    }

    end = () => {
        return this.end;
    }

    reciveChar(ch) {
        if(ch === '\r') {
            return this.waitingStatusLine
        }
        return this.reciveChar;
    }

    // 这个状态读取所有的statusLine字符
    waitingStatusLine = (ch) => {
        if(ch === '\r') {
            return this.waitingStatusLineEnd;
        }
        this.statusLine += ch;
        // 重新回到自己的状态
        return this.waitingStatusLine;
    }

    waitingStatusLineEnd = (ch) => {
        if(ch === '\n') {
            // 进入header阶段
            this.headerName = '';
            return this.waitingHeaderName;
        }
        return this.wrongStatusLine();
    }

    wrongStatusLine = () => {
        console.error('wrong status line');
        return this.end;
    }

    // 这个状态读取所有的header, \r\n结束
    waitingHeaderName = (ch) => {
        if(ch === '\r') {
            return this.waitingHeaderBlockEnd;
        }
        if(ch === ':') {
            return this.waitingHeaderSpace
        }
        this.headerName += ch;
        return this.waitingHeaderName;
    }

    waitingHeaderSpace = (ch) => {
        if(ch === ' ') {
            // 重置一下value
            this.headerValue = '';
            return this.waitingHeaderValue;
        }
        return this.wrongHeader();
    }

    waitingHeaderValue = (ch) => {
        if(ch === '\r') {
            this.headers[this.headerName] = this.headerValue;
            return this.waitingHeaderLineEnd;
        }
        this.headerValue += ch;
        return this.waitingHeaderValue;
    }

    waitingHeaderLineEnd = (ch) =>{
        if(ch === '\n') {
            return this.waitingHeaderName;
        }
        return this.wrongHeader();
    }
    
    waitingHeaderBlockEnd = (ch) => {
        if(ch === '\n') {
            if(this.headers['Transfer-Encoding'] === 'chunked') {
                this.bodyParser = new BodyParser();
            } else {
                this.bodyParser = new BodyParser();
            }
            return this.waitingBody;
        }
        return this.wrongHeader();

    }

    waitingBody = (ch) => {
        if(this.bodyParser.isFinished) {
            this.isFinished = true;
            return this.end
        }
        this.bodyParser.recive(ch);
        return this.waitingBody;
    }

    wrongHeader = () => {
        console.error('wrong header');
        return this.end;
    }


    isFinished = () => {
        return true;
    }

    get response() {
        return this.bodyParser.result;
    }
}

module.exports = ResponseParser;
