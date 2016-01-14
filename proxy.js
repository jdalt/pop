var http = require('http'),
    httpProxy = require('http-proxy'),
    fs = require('fs'),
    textBody = require('body'),
    _ = require('lodash'),
    bunyan = require('bunyan')

var log = bunyan.createLogger({
  name: 'pop_proxy_log',
  streams: [{
    level: 'trace',
    stream: process.stdout
  },{
    level: 'info',
    path: './log/pop_proxy.log'
  }]
})

var proxy = httpProxy.createProxyServer({});

proxy.on('error', function (err, req, res) {
  log.error(err, proxyInfo(req))
  res.writeHead(500, {'Content-Type': 'text/plain'})
  res.end('Unable to contact proxied port: ' + req.pop.port)
})

proxy.on('proxyRes', function(proxyRes, req, res, options) {
  log.info(_.extend(proxyInfo(req, 'response'), { statusCode: proxyRes.statusCode, responseHeaders: proxyRes.headers }))
})

// TODO: reread file on change
var configJson = JSON.parse(fs.readFileSync('./config/ports.json'));
var ports = configJson.ports
log.info({portConfig: ports })

var server = http.createServer(function(req, res) {
  // TODO: move default port and TLD to config
  var targetPort = 3000 // default
  var hostMatch = req.headers['host'].match(/(.*)\.dev/)
  if(hostMatch) {
    var host = hostMatch[1]

    var targetPort = ports[host]
    if(targetPort == undefined) {
      targetPort = 3000
    } else {
      req.headers['POP_PROXY_PORT'] = targetPort
    }
  } else {
    log.error('Unable to get host')
  }

  req.pop = {
    uuid: randomValueHex(6),
    host: host,
    port: targetPort
  }
  log.info(proxyInfo(req, 'request'))

  var domain = 'http://0.0.0.0:' + targetPort
  proxy.web(req, res, { target: domain })
});

function proxyInfo(req, type) {
  return {
    type: type,
    uuid: req.pop.uuid,
    method: req.method,
    host: req.pop.host,
    port: req.pop.port,
    url: req.url,
    body: req.body,
    headers: req.headers
  }
}


var crypto = require('crypto');
function randomValueHex (len) {
  return crypto.randomBytes(Math.ceil(len/2))
  .toString('hex') // convert to hexadecimal format
  .slice(0,len);   // return required number of characters
}

server.listen(20559)
