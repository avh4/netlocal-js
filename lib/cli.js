// var flatiron = require('flatiron');
// var path = require('path');
var http = require('http');

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

var server;
var responseBody;

function openStubPort(port, body) {
    responseBody = body;
    if (server) return;
    server = http.createServer(function(request, response) {
        console.log(port + ": " + request.method + " " + request.url);
        response.writeHead(202);
        response.end(responseBody);
    });
    server.listen(port);
}

module.exports = {
    start: function() {
        http.createServer(function(request, response) {
            console.log("control: " + request.method + " " + request.url);
            if (request.method == 'POST') {
                var body = "";
                request.on("data", function(chunk) {
                    body += chunk;
                });
                request.on("end", function() {
                    openStubPort(8765, body);
                    response.end();
                });
            } else if (request.method == 'DELETE') {
                if (server) {
                    server.close(function() {
                        response.end();
                    });
                    server = undefined;
                } else {
                    response.end();
                }
            } else {
                response.end();
            }
        }).listen(9999);
    }
}
