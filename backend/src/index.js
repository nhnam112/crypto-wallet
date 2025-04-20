const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const walletService = require('./walletService');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: '*' } });

io.on('connection', (socket) => {
  console.log('Client connected');

  socket.on('login', async ({ address, privateKey }) => {
    await walletService.storePrivateKey(address, privateKey);
    socket.emit('loggedIn', { address });
  });

  socket.on('sendTransaction', async (txData) => {
    try {
      const result = await walletService.handleTransaction(txData);
      socket.emit('txResult', result);
    } catch (err) {
      socket.emit('txError', err.message);
    }
  });

  socket.on('getBalance', async ({ address, network }) => {
    const balance = await walletService.getBalance(address, network);
    socket.emit('balance', balance);
  });
});

server.listen(3001, () => console.log('Backend listening on port 3001'));
