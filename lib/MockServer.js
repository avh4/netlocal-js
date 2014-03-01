var http = require('http');
var Promise = require('promise');

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
    this.server.listen(this.port);
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
