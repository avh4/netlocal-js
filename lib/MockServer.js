var http = require('http');
var Promise = require('promise');
var net = require('net');

function MockServer(port) {
    this.port = port;
    this.stubs = {};
}

MockServer.prototype.start = function() {
    var self = this;
    this.server = http.createServer(function(request, response) {
        console.log(self.port + ": " + request.method + " " + request.url);
        var stub = self.stubs[request.url];
        if (stub) {
            response.setHeader('content-type', stub.contentType);
            response.writeHead(stub.code);
            response.end(stub.body);
        } else {
            response.writeHead(404);
            response.end();
        }
    });
    var checkInaddrAny = new Promise(function(resolve, reject) {
        var server = net.createServer();
        server.on("error", reject);
        server.on("listening", function() {
            server.close(resolve);
        });
        server.listen(self.port);
    });
    return checkInaddrAny.then(function() {
        return new Promise(function(resolve, reject) {
            self.server.on("error", reject);
            self.server.on("listening", resolve);
            self.server.listen(self.port, 'localhost');
        });
    });
}

MockServer.prototype.stubGet = function(path, code, contentType, body) {
    this.stubs[path] = {
        body: body,
        code: code,
        contentType: contentType
    }
}

MockServer.prototype.shutdown = function() {
    var self = this;
    return new Promise(function(resolve, reject) {
        self.server.close(function() {
            resolve();
        });
    });
}

module.exports = MockServer;
