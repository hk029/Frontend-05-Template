var http = require('http');

http.createServer(function (request, response) {

    console.log('request', request);

    // 发送 HTTP 头部 
    // HTTP 状态值: 200 : OK
    // 内容类型: text/plain
    response.writeHead(200, {'Content-Type': 'text/plain'});

    // 发送响应数据 "Hello World"
    response.end(`<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
    body div #container{
        width: 100px;
        background: #fff;
    }
    body div img {
        width: 30px;
        background: red;
    }
    </style>
</head>
<body>
    <div id="container">
        123
    </div>
    <img />
</body>
</html>
`);
}).listen(8888);

// 终端打印如下信息
console.log('Server running at http://127.0.0.1:8888/');