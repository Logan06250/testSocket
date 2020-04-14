'use strict';

const express = require('express');
const socketIO = require('socket.io');

const PORT = process.env.PORT || 3000;
const INDEX = '/index.html';

const server = express()
  //.use((req, res) => res.sendFile(INDEX, { root: __dirname }))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

const io = socketIO(server);

var users = [];

io.on('connection', (socket) => {

  socket.on("name", name => {
    socket.nickname = name;
    users.push(socket.nickname)
    socket.emit("users", users)
    console.log('Client connected : ' + socket.nickname);
  });
  socket.on('disconnect', () => {
    users.splice(users.indexOf(socket.nickname), 1)
    socket.emit("users", users)
    console.log('Client disconnected : ' + socket.nickname);
  });
});

setInterval(() => io.emit('time', new Date().toTimeString()), 1000);
