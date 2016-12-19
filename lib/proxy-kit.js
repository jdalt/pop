var httpProxy = require('http-proxy'),
    fs = require('fs'),
    _ = require('lodash'),
    crypto = require('crypto'),
    bunyan = require('bunyan'),
    path = require('path'),
    yaml = require('js-yaml')

var log = bunyan.createLogger({
  name: 'proxy',
  streams: [{
    level: 'trace',
    stream: process.stdout
  },{
    level: 'info',
    path: path.resolve(__dirname, '../log/proxy.log')
  }]
})

module.exports = function proxyKit() {

  function createProxy() {
    var proxy = httpProxy.createProxyServer({});

    proxy.on('error', function (err, req, res) {
      log.error(_.extend(proxyInfo(req, 'error'), { error: { err: err.toString(), stack: err.stack }}))
      res.writeHead(500, {'Content-Type': 'text/plain'})
      res.end('Unable to contact proxied port: ' + req.pop.port)
    })

    proxy.on('proxyRes', function(proxyRes, req, res, options) {
      if (!proxyRes.headers['content-encoding']) {
        var proxyResBody = ''
        proxyRes.on('data', function(data) { proxyResBody += data })
        proxyRes.on('end', function() {
          var responseBody = proxyResBody.toString()
          if (proxyRes.headers['content-type'] === 'application/json') {
            responseBody = JSON.stringify(JSON.parse(responseBody), null, 2)
          }
          log.info(_.extend(proxyInfo(req, 'response'), { statusCode: proxyRes.statusCode, responseHeaders: proxyRes.headers, responseBody: responseBody }))
        })
      } else {
        log.info(_.extend(proxyInfo(req, 'response'), { statusCode: proxyRes.statusCode, responseHeaders: proxyRes.headers }))
      }
    })

    return proxy
  }

  function getDomain(req, res) {
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

    return 'http://0.0.0.0:' + targetPort
  }

  function handleRequest(req, res) {
    proxy.web(req, res, { target: getDomain(req, res) })
  }

  const portsYml = path.resolve(__dirname, '../config/ports.yml')
  function getPorts() {
    ports = yaml.safeLoad(fs.readFileSync(portsYml))
    log.info({ message: '***PORTS RELOADED***', portConfig: ports })
  }

  var proxy = createProxy()
  var ports
  getPorts()
  fs.watchFile(portsYml, getPorts)

  log.info('Pop Http Proxy Started')
  return {
    requestHandler: handleRequest
  }
}

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

function randomValueHex (len) {
  return crypto.randomBytes(Math.ceil(len/2))
  .toString('hex') // convert to hexadecimal format
  .slice(0,len);   // return required number of characters
}
