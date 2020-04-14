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

var positions = []

io.on('connection', (socket) => {
  socket.on("name", name => {
    socket.nickname = name;

    positions.push( {
      name: socket.nickname,
      x: 200,
      y: 200
    })

    users.push(socket.nickname)
    socket.emit("users", users)
    console.log('Client connected : ' + socket.nickname);
  });

  socket.emit("position", positions)
  socket.on('move', (data) => {

    const found = positions.find(el => el.name == socket.nickname);

    const index = positions.indexOf(found)
    switch(data) {
      case "left":
          positions[index].x -= 5;
          io.emit("position", positions);
          break;
      case "right":
          positions[index].x += 5;
          io.emit("position", positions);
          break;
      case "up":
          positions[index].y -= 5;
          io.emit("position", positions);
          break;
      case "down":
          positions[index].y += 5;
          io.emit("position", positions);
          break;
    }
  });

  socket.on('disconnect', () => {
    users.splice(users.indexOf(socket.nickname), 1)
    socket.emit("users", users)
    console.log('Client disconnected : ' + socket.nickname);
  });
});
