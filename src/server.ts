/* eslint-disable no-restricted-syntax */
import express from 'express';
import http from 'http';
import path from 'path';
import cors from 'cors';
import { Server } from 'socket.io';
import {
  rooms,
  exitRoom,
} from '../utils/rooms';
import {
  connectedUsers,
  choices,
  winCombinations,
  initializeChoices,
  makeMove,
} from '../utils/users';
import {
  create,
  join,
  joinRandom,
} from './controllers/roomsController';

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.static(path.join(__dirname, 'src')));

const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

io.on('connection', (socket) => {
  socket.on('create_room', create);

  socket.on('join_room', join);

  socket.on('join_random_room', joinRandom);

  socket.on('choose', ({ playerId, playerChoice, roomId }) => {
    makeMove(roomId, playerId, playerChoice);
    io.to(roomId).emit('player_chose', playerId);

    if (choices[roomId][0] !== '' && choices[roomId][1] !== '') {
      const playerOneChoice = choices[roomId][0];
      const playerTwoChoice = choices[roomId][1];

      if (playerOneChoice === playerTwoChoice) {
        io.to(roomId).emit('draw', 'It`s draw');
      } else if (winCombinations[playerOneChoice] === playerTwoChoice) {
        io.to(roomId).emit('player_1_wins',
          { playerOneChoice, playerTwoChoice });
      } else {
        io.to(roomId).emit('player_2_wins',
          { playerTwoChoice, playerOneChoice });
      }

      io.to(roomId).emit('lock_choice');

      initializeChoices(roomId);
    }
  });

  socket.on('restart', (roomId) => {
    io.to(roomId).emit('restart');
  });

  socket.on('disconnect', () => {
    if (connectedUsers[socket.id]) {
      let player;
      let roomId;

      for (const id in rooms) {
        if (rooms[id].includes(socket.id)) {
          if (rooms[id][0] === socket.id) {
            player = 1;
          } else {
            player = 2;
          }

          roomId = id;
          break;
        }
      }

      if (player && roomId) {
        exitRoom(roomId, player);

        if (player === 1) {
          io.to(roomId).emit('player_1_disconnected');
        } else {
          io.to(roomId).emit('player_2_disconnected');
        }
      }
    }
  });
});

server.listen(() => {
  // eslint-disable-next-line no-console
  console.log('Server is running...');
});
