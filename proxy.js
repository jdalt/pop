var http = require('http'),
    proxyKit = require('./lib/proxy-kit.js')()

http.createServer(proxyKit.requestHandler).listen(20559)

