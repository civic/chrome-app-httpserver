var se = require("stringencoding");
var encoder = new se.TextEncoder("utf-8");
var decoder = new se.TextDecoder("utf-8");


var Server = function(){
    this.serverSocketId = null;
    this.onAccept = onAccept.bind(this);
    this.onReceive = onReceive.bind(this);
};
Server.prototype = {
    start: function(receiveCallback){
        this.receiveCallback = receiveCallback;
        chrome.sockets.tcpServer.create({}, function(createInfo) {
            // サーバ用のソケット
            this.serverSocketId = createInfo.socketId;

            // 3000番ポートをlisten
            chrome.sockets.tcpServer.listen(this.serverSocketId, '0.0.0.0', 3000, function(resultCode) {
                if (resultCode < 0) {
                    console.log("Error listening:" + chrome.runtime.lastError.message);
                }
            });
        }.bind(this));

        chrome.sockets.tcpServer.onAccept.addListener(this.onAccept);
        chrome.sockets.tcp.onReceive.addListener(this.onReceive);
        console.log("started");
    },
    stop: function(){
        chrome.sockets.tcpServer.disconnect(this.serverSocketId);
        chrome.sockets.tcpServer.close(this.serverSocketId);

        chrome.sockets.tcpServer.onAccept.removeListener(this.onAccept);
        chrome.sockets.tcp.onReceive.removeListener(this.onReceive);
    }
}
 
function onAccept(info){
    if (info.socketId === this.serverSocketId) {
        chrome.sockets.tcp.setPaused(info.clientSocketId, false);
    }
}
function onReceive(info) {
    console.log("Receive: ", info);
 
    // リクエスト確認: ArrayBufferを文字列に変換
    // 本来はヘッダの先頭と、Content-Length等からリクエストの範囲を検出し、
    // 受信データからHTTPリクエストを取り出す必要がある
    var requestText = decoder.decode(new Uint8Array(info.data));
    console.log(requestText);

    if (this.receiveCallback) {
        this.receiveCallback(requestText);
    }
 
    // レスポンス送信
    var socketId = info.socketId;
    var message = 'Hello world';
    var responseText = [
        ' HTTP/1.1 200 OK',
        'Content-Type: text/plain',
        'Content-Length: ' + message.length,
        '',
        message
    ].join("\n");
    chrome.sockets.tcp.send(socketId, encoder.encode(responseText).buffer, function(info) {
        if (info.resultCode < 0) {
            console.log("Error sending:" + chrome.runtime.lastError.message);
        }
 
        // ソケット破棄
        chrome.sockets.tcp.disconnect(socketId);
        chrome.sockets.tcp.close(socketId);
    });
}
 
module.exports = Server;

