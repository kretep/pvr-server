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
var fs = require('fs');

// Read environment variables from file
// (Saved before run or build, included in pkg executable)
let env = {};
fs.readFile(path.join(__dirname, '.env.json'), 'utf8', (err, data) => {
  if (err) {
    console.log("Error reading environment variables: " + err);
  }
  else {
    env = JSON.parse(data);
  }
});

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
  else if (req.url === '/version') {
    res.write(JSON.stringify({ 
      name: env.APP_NAME,
      version: env.APP_VERSION,
      githead: env.APP_GITHEAD
    }));
    res.end();
  }
  else {
    if (process.env.NODE_ENV === 'development') {
      // Redirect to running react app
      proxy.web(req, res, {
        target: 'http://localhost:3000'
      });
    }
    else {
      // Serve static files in app directory
      fileServer.serve(req, res, function (e, r) {
        if (e && (e.status === 404)) { // Catch-all in case file is not found
            fileServer.serveFile('index.html', 200, {}, req, res);
        }
      });
    }
  }
})

// server.on('error', function(err, req, res) {
//   res.writeHead(500, { 
//     'Content-Type': 'text/plain'
//   });
//   res.end('An error occurred: ' + err);
// })

if (process.env.NODE_ENV === 'development') {
  server.listen(9090);
}
else {
  server.listen(80); // Some ports (e.g. 80) may require admin privileges
}
