// var flatiron = require('flatiron');
// var path = require('path');
var http = require('http');
var Promise = require('promise');
var MockServer = require('./MockServer');

// var app = module.exports = flatiron.app;
// 
// app.config.file({
//     file: path.join(__dirname, 'config', 'config.json')
// });
// 
// app.use(flatiron.plugins.cli, {
//     source: path.join(__dirname, 'lib', 'commands'),
//     usage: 'Empty Flatiron Application, please fill out commands'
// });

var mocks = {};

function openStubPort(port, path, code, contentType, body) {
    var mock = mocks[port];
    if (!mock) {
        mock = new MockServer(port);
        console.log("STARTING: " + port);
        return mock.start().then(function() {
            mock.stubGet(path, code, contentType, body);
            mocks[port] = mock;
            console.log("STARTED: " + port);
        });
    } else {
        return new Promise(function(resolve, reject) {
            mock.stubGet(path, code, contentType, body);
            resolve();
        });
    }
}

module.exports = {
    start: function() {
        http.createServer(function(request, response) {
            console.log("control: " + request.method + " " + request.url);
            if (request.method == 'POST') {
                var body = "";
                var code = request.headers['x-netlocal-response-code'] || 200;
                var match = request.url.match(/^\/http\/([0-9]+)\/(get)(\/.*$)/);
                var port = match[1];
                var method = match[2];
                var path = match[3];
                var contentType = request.headers['content-type'];
                request.on("data", function(chunk) {
                    body += chunk;
                });
                request.on("end", function() {
                    openStubPort(port, path, code, contentType, body)
                        .done(function() {
                            response.end();
                        }, function(err) {
                            response.writeHead(503);
                            response.end(err.toString());
                        });
                });
            } else if (request.method == 'DELETE') {
                var ps = [];
                for (var port in mocks) {
                    var mock = mocks[port];
                    console.log("SHUTDOWN: " + port);
                    ps.push(mock.shutdown());
                }
                mocks = {};
                var p = Promise.all(ps);
                p.done(function() {
                    response.end();
                });
            } else {
                response.end();
            }
        }).listen(9999);
    }
}
