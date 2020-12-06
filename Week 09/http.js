
/**
 *  从使用角度去设计
 *  method, host, port, path, headers
 *  headers中content type 必要，有默认值
 *  body是KV格式（方便使用）
 *  不同的type影响body格式
 *  有send方法
 */

const net = require('net');
const ResponseParser = require('./responseParser');
const HtmlParser = require('./htmlParser');
const CssParser = require('./CssParser');

const OPTIONS_MAP = {
    method: 'GET',
    host: '',
    port: 80,
    path: '/',
    body: {},
    headers: {},
};

class Request {
    constructor(options) {
        const bindOptions = (param, defaultVal) => {
            this[param] = options[param] || defaultVal
        };
        // 把所有的options数据挂到this上
        Object.keys(OPTIONS_MAP).forEach(key => bindOptions(key, OPTIONS_MAP[key]));
        if (!this.headers['Content-Type']) {
            this.headers['Content-Type'] = 'application/x-www-form-urlencoded';
        }
        // 根据不同的content-type去解析body
        if (this.headers['Content-Type'] === 'application/josn') {
            this.bodyText = JSON.stringify(this.body);
        } else if (this.headers['Content-Type'] === 'application/x-www-form-urlencoded') {
            this.bodyText = Object.keys(this.body).map(key => `${key}=${encodeURIComponent(this.body[key])}`).join('&');
        }
        this.headers['Content-Length'] = this.bodyText.length;
    }

    send(connection) {
        return new Promise((resolve, reject) => {
            const parser = new ResponseParser();
            if (connection) {
                connection.write(this.toString());
            } else {
                connection = net.createConnection({
                    host: this.host,
                    port: this.port
                }, () => {
                    connection.write(this.toString());
                })
            }
            connection.on('data', data => {
                parser.recive(data.toString());
                if (parser.isFinished) {
                    resolve(parser.response);
                    connection.end();
                }
            });
            connection.on('error', (err) => {
                reject(err);
                connection.end();
            });
        });
    }
    toString() {
        return `${this.method} ${this.path} HTTP/1.1\r
${Object.keys(this.headers).map(key => `${key}: ${this.headers[key]}`).join('\r\n')}\r
\r
${this.bodyText}`;
    }
}

// 在使用立即执行的函数表达式时，可以利用 void 运算符让 JavaScript 引擎把一个function关键字识别成函数表达式而不是函数声明（语句）。
void async function () {
    let request = new Request({
        method: 'GET',
        host: '127.0.0.1',
        port: '8888',
        path: '/',
        headers: {
            ['X-Foo2']: 'customed'
        },
        body: {
            name: 'hk'
        }
    })

    const htmlParser = new HtmlParser();
    const cssParser = new CssParser();
    let response = await request.send();
    const stack = htmlParser.recive(response);


    console.log(response, stack);
}();
