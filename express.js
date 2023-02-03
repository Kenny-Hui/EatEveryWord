const http = require('http');

http.createServer(function (req, res) {
  res.write("Webserver alive.");
  res.end();
}).listen(8000);