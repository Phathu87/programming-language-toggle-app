const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: { origin: '*' } // Allow cross-origin requests
});

io.on('connection', (socket) => {
  console.log('User connected');

  socket.on('send_message', (msg) => {
    console.log('Message received:', msg);
    io.emit('receive_message', msg); // Broadcast the message to all connected clients
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

server.listen(5000, () => {
  console.log('Server running on port 5000');
});
