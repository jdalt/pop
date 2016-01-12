var http = require('http'),
    httpProxy = require('http-proxy'),
    fs = require('fs'),
    bunyan = require('bunyan')

var log = bunyan.createLogger({name: 'http_proxy'})
// {
//   name: '',
//   streams: [
//     {
//     level: 'info',
//     stream: process.stdout            // log INFO and above to stdout
//   },
//   {
//     level: 'error',
//     path: '/var/tmp/myapp-error.log'  // log ERROR and above to a file
//   }
//   ]
// }

var proxy = httpProxy.createProxyServer({});

proxy.on('error', function (err, req, res) {
  var popPort = req.headers['POP_PROXY_PORT']
  err.popPort = popPort
  log.error(err)
  res.writeHead(500, {'Content-Type': 'text/plain'})
  res.end('Unable to contact proxied port: ' + popPort)
})

// TODO: reread file on change
var configJson = JSON.parse(fs.readFileSync('ports.json'));
var ports = configJson.ports
log.info({portConfig: ports })

// TODO: give each port a randomly defined color

var server = http.createServer(function(req, res) {
  var targetPort = 3000 // default
  var hostMatch = req.headers['host'].match(/(.*)\.dev/)
  if(hostMatch) {
    var host = hostMatch[1]

    var targetPort = ports[host]
    if(targetPort == undefined) {
      log.warn('Unable to find port match')
      targetPort = 3000
    } else {
      req.headers['POP_PROXY_PORT'] = targetPort
    }
    log.info(req.method + ' ' + host + ' proxied to ' + targetPort + ' ' + req.url)
  } else {
    log.error('Unable to get host')
  }

  var domain = 'http://0.0.0.0:' + targetPort
  proxy.web(req, res, { target: domain })
});

var listenPort = 20559
log.info('Listening on ' + listenPort)
server.listen(20559)
