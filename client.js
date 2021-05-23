var http = require('http');
 
// 用于请求的选项
var options = {
   host: '127.0.0.1',
   port: '8081',
   path: '/index.html'  
};

var WebSocket = require('ws');

var ws = new WebSocket("ws://localhost:8080");
ws.onopen = function(event) {
    ws.send("Hello there");
}
ws.onmessage = function(event) {
    console.log(event.data);
}
 
