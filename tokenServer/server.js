const http = require('http');
const url = require('url');

const QiNiu = require('qiniu');

const QiNiuConfig = require('./qiniu.config');

let mac = new QiNiu.auth.digest.Mac(
    QiNiuConfig.accessKey,
    QiNiuConfig.secretKey
);

let options = {
    scope: QiNiuConfig.bucket,
    expires: 3600 * 12,
};

let port = process.argv[2] || 12321;

let server = http.createServer((request_, response_) => {
    let parsedUrl = url.parse(request_.url, true);
    let path = request_.url;
    let query = '';
    if (path.indexOf('?') >= 0) {
        query = path.substring(path.indexOf('?'))
    }
    let pathNoQuery = parsedUrl.pathname;
    let queryObject = parsedUrl.query;
    let method = request_.method;
    /******** 从这里开始看，上面不要看 ************/
    response_.setHeader('Access-Control-Allow-Origin', '*');
    response_.setHeader('Content-Type', 'text/html;charset=utf-8');
    if (pathNoQuery === '/token') {
        let putPolicy = new QiNiu.rs.PutPolicy(options);
        let uploadToken = putPolicy.uploadToken(mac);
        response_.write(uploadToken);
        response_.end();
        return
    }
    response_.statusCode = 404;
    response_.end();
    /******** 代码结束，下面不要看 ************/
});

server.listen(port);

console.log(`
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Token server run on localhost:${port}

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
`);