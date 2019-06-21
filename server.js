// Define String.startsWith()
if (typeof String.prototype.startsWith != 'function') {
  String.prototype.startsWith = function (str){
    return this.slice(0, str.length) == str;
  };
}

var http = require('http');
var httpProxy = require('http-proxy');
var static = require('node-static');
var path = require('path');

var proxy = httpProxy.createProxyServer();
var fileServer = new static.Server(path.join(__dirname, 'app/'));

proxy.on('error', function(err, req, res) {
  console.log('proxy error: ', err);
  res.writeHead(500, { 
    'Content-Type': 'text/plain'
  });
  res.end('Proxy error: ' + err);
});

let server = http.createServer(function (req, res) {

  // Log debug info
  var debug = {
    timestamp: new Date().toISOString(),
    remote: req.connection.remoteAddress,
    url: req.url,
    method: req.method
  }
  console.log(JSON.stringify(debug) + ',');

  if (req.url.startsWith('/api/')) {
    // Map url to database name
    req.url = '/jdreg' + req.url.substring(4);

    // Simulate latency
    setTimeout(function () {
      // Proxy to restheart
      proxy.web(req, res, {
        target: 'http://localhost:8080'
      });
    }, 1);
  }
  else {
    fileServer.serve(req, res);
    /*proxy.web(req, res, {
      target: 'http://localhost:3000'
    });*/
  }
})

server.on('error', function(err, req, res) {
  res.writeHead(500, { 
    'Content-Type': 'text/plain'
  });
  res.end('An error occurred:' + err);
})

server.listen(9090); // Some ports (e.g. 80) may require admin privileges
