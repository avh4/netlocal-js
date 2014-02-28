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

module.exports = {
    start: function() {
        http.createServer(function(request, response) {
            response.end();
        }).listen(9999);
        http.createServer(function(request, response) {
            response.writeHead(202);
            response.end();
        }).listen(8765);
    }
}
