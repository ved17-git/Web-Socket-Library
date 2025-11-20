"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_http_1 = __importDefault(require("node:http"));
const crypto_1 = __importDefault(require("crypto"));
const magicGUID = "258EAFA5-E914-47DA-95CA-C5AB0DC85B11";
const server = node_http_1.default.createServer((req, res) => {
    res.end("Hello from server");
});
server.on("upgrade", (req, socket, header) => {
    const sec_key = req.headers["sec-websocket-key"];
    const acceptKey = hashed(sec_key);
    const headers = setHeaders(acceptKey);
    socket.write(headers);
});
function setHeaders(acceptKey) {
    const headers = "HTTP/1.1 101 Switching Protocols\r\n" +
        "Upgrade: websocket\r\n" +
        "Connection: Upgrade\r\n" +
        `Sec-WebSocket-Accept: ${acceptKey}\r\n` +
        "\r\n";
    return headers;
}
function hashed(id) {
    const temp = id + magicGUID;
    const hash = crypto_1.default.createHash("sha1");
    hash.update(temp);
    return hash.digest("base64");
}
server.listen(8000, () => {
    console.log("listening on 8000");
});
