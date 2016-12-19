var dns = require('native-dns'),
  server = dns.createServer(),
  path = require('path'),
  bunyan = require('bunyan')

var log = bunyan.createLogger({
  name: 'dns',
  streams: [{
    level: 'trace',
    stream: process.stdout
  },{
    level: 'info',
    path: path.resolve(__dirname, 'log/dns.log')
  }]
})

var reqCount = 0
server.on('request', function (request, response) {
  reqCount += 1;
  var question = request.question[0]
  log.info(reqCount + ' ' + question.name + ' ' + question.type)
  response.answer.push(dns.A({
    name: question.name,
    address: '127.0.0.1',
    ttl: 1,
  }));
  response.send();
});

server.on('error', function (err, buff, req, res) {
  log.error(err)
});

var listenPort = 20565
log.info('Pop DNS listening on ' + listenPort)
server.serve(listenPort)
