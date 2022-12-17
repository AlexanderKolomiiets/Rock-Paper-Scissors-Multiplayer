/* eslint-disable no-restricted-syntax */
import express from 'express';
import http from 'http';
import path from 'path';
import cors from 'cors';
import { Server } from 'socket.io';
import { Error } from './types/Error';
import {
  rooms,
  createRoom,
  joinRoom,
  exitRoom,
} from './utils/rooms';
import {
  connectedUsers,
  choices,
  winCombinations,
  initializeChoices,
  userConnected,
  makeMove,
} from './utils/users';

const app = express();
const PORT = process.env.PORT || 3001;

const server = http.createServer(app);

app.use(cors());
app.use(express.static(path.join(__dirname, 'src')));

const io = new Server(server, {
  cors: { origin: 'http://localhost:3000' },
});

io.on('connection', (socket) => {
  socket.on('create_room', (roomId) => {
    if (rooms[roomId]) {
      socket.emit('show_error', Error.Exist);
    } else {
      userConnected(socket.id);
      createRoom(roomId, socket.id);
      socket.emit('room_created', roomId);
      socket.emit('player_1_connected');
      socket.join(roomId);
    }
  });

  socket.on('join_room', (roomId) => {
    if (!rooms[roomId]) {
      socket.emit('show_error', Error.NotExist);
    } else {
      userConnected(socket.id);
      joinRoom(roomId, socket.id);
      socket.join(roomId);

      socket.emit('room_joined', roomId);
      socket.emit('player_2_connected');
      socket.broadcast.to(roomId).emit('player_2_connected');
      initializeChoices(roomId);
    }
  });

  socket.on('join_random_room', () => {
    let roomId = '';

    for (const id in rooms) {
      if (rooms[id][1] === '') {
        roomId = id;
        break;
      }
    }

    if (roomId === '') {
      socket.emit('show_error', Error.Full);
    } else {
      userConnected(socket.id);
      joinRoom(+roomId, socket.id);
      socket.join(roomId);

      socket.emit('room_joined', roomId);
      socket.emit('player_2_connected');
      socket.broadcast.to(roomId).emit('player_2_connected');
      initializeChoices(+roomId);
    }
  });

  socket.on('turn', ({ playerId, playerChoice, roomId }) => {
    makeMove(roomId, playerId, playerChoice);
  });
});

server.listen(`${PORT}`, () => {
  console.log(`Server started on port: ${PORT}`);
});

export {};
