
var express = require('express');
var app = express();

app.get('/', function (req, res) {
  console.log('url', req.url)
  console.log('host', req.headers['host'])
  res.send('Hello World!');
});

app.post('/', function (req, res) {
  console.log('url', req.url)
  console.log('host', req.headers['host'])
  res.send('Post World ...');
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
})

