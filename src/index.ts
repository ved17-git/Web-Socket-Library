import http from 'node:http'
import crypto from 'crypto'
import express from 'express'

// 258EAFA5-E914-47DA-95CA-C5AB0DC85B11
const magicGUID="258EAFA5-E914-47DA-95CA-C5AB0DC85B11"

const server=http.createServer((req,res)=>{
    res.end("Hello from server")
})

server.on("upgrade", (req,socket, header)=>{

    
    const sec_key = req.headers["sec-websocket-key"]!; 
    const acceptKey=hashedSecKey(sec_key)     

    const headers=setHeadersAcceptKey(acceptKey)    
    socket.write(headers)
})


function setHeadersAcceptKey(acceptKey:string){
      
  const headers =
    "HTTP/1.1 101 Switching Protocols\r\n" +
    "Upgrade: websocket\r\n" +
    "Connection: Upgrade\r\n" +
    `Sec-WebSocket-Accept: ${acceptKey}\r\n` +
    "\r\n";
   
   return headers
}

function hashedSecKey(id:string){
    const temp=id+magicGUID
    const hash=crypto.createHash("sha1")
    hash.update(temp)

    return hash.digest("base64"); 
}


server.listen(8000,()=>{
    console.log("listening on 8000");
})