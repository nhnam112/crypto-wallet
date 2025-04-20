import { io } from "socket.io-client";

const socket = io(process.env.REACT_APP_BACKEND_ENDPOINT);

export function login(address, privateKey) {
  socket.emit('login', { address, privateKey });
}

export function sendTransaction(txData) {
  socket.emit('sendTransaction', txData);
}

export function getBalance(address, network, callback) {
  socket.emit('getBalance', { address, network });
  socket.on('balance', callback);
}

socket.on('txResult', (res) => console.log("Transaction confirmed:", res));
socket.on('txError', (err) => console.error("Transaction error:", err));
