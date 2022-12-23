/* eslint-disable no-console */
import { useState, useEffect } from 'react';
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
} from 'react-router-dom';
import { io } from 'socket.io-client';
import { Error } from '../types/Error';
import { Choice } from '../types/Choice';
import './App.scss';
import Menu from './components/Menu';
import Game from './components/Game';

const socket = io('http://localhost:3001');

function App() {
  const [playerId, setPlayerId] = useState(0);
  const [playerOneStatus, setPlayerOneStatus] = useState(false);
  const [playerTwoStatus, setPlayerTwoStatus] = useState(false);
  const [choice, setChoice] = useState<null | Choice>(null);
  const [waiting, setWaiting] = useState(true);
  const [playerWinning, setPlayerWinning] = useState<null | string>(null);
  const [enemyWinning, setEnemyWinning] = useState<null | string>(null);
  const [roomId, setRoomId] = useState(0);
  const [canChoose, setCanChoose] = useState(false);
  const [playerScore, setPlayerScore] = useState(0);
  const [enemyScore, setEnemyScore] = useState(0);
  const [firstPlayerWon, setFirstPlayerWon] = useState<null | boolean>(null);
  const [error, setError] = useState<null | Error>(null);

  const navigate = useNavigate();

  const handleChoice = (item: Choice) => {
    if (canChoose && playerOneStatus && playerTwoStatus) {
      const playerChoice = item;

      setChoice(item);
      socket.emit('choose', { playerId, playerChoice, roomId });
      setCanChoose(false);
    }
  };

  const handleCreateRoom = (id: string) => {
    setError(null);
    socket.emit('create_room', id);
  };

  const handleJoinRoom = (id: string) => {
    setError(null);
    socket.emit('join_room', id);
  };

  const handleJoinRandomRoom = () => {
    setError(null);
    socket.emit('join_random_room');
  };

  // const handleRestart = () => {
  //   setWinning(null);
  //   setCanChoose(true);
  // };

  useEffect(() => {
    socket.on('show_error', (err) => {
      setError(err);
    });

    socket.on('room_created', (id) => {
      setPlayerId(1);
      setRoomId(id);
      if (!error) {
        navigate('/game');
      }
    });

    socket.on('room_joined', (id) => {
      setPlayerId(2);
      setRoomId(id);
      setPlayerOneStatus(true);
      if (!error) {
        navigate('/game');
      }

      setWaiting(false);
    });

    socket.on('player_1_connected', () => {
      setPlayerOneStatus(true);
    });

    socket.on('player_2_connected', () => {
      setPlayerTwoStatus(true);
      setCanChoose(true);
      setWaiting(false);
    });

    socket.on('player_1_disconnected', () => {
      setCanChoose(false);
      setPlayerOneStatus(false);
      setPlayerTwoStatus(false);
      navigate('/home');
      setPlayerScore(0);
      setEnemyScore(0);
      setWaiting(true);
    });

    socket.on('player_2_disconnected', () => {
      setCanChoose(false);
      setPlayerTwoStatus(false);
      setWaiting(true);
      setPlayerScore(0);
      setEnemyScore(0);
    });

    socket.on('draw', (message: string) => {
      setPlayerWinning(message);
    });

    socket.on('player_1_wins', ({ playerChoice, enemyChoice }) => {
      setFirstPlayerWon(true);
      setPlayerWinning(`You chose ${playerChoice} and your opponent chose ${enemyChoice}, so you won1 )`);
      setEnemyWinning(`You chose ${enemyChoice} and your opponent chose ${playerChoice}, so you lost1 (`);
    });

    socket.on('player_2_wins', ({ playerChoice, enemyChoice }) => {
      setFirstPlayerWon(false);
      setPlayerWinning(`You chose ${playerChoice} and your opponent chose ${enemyChoice}, so you won2 )`);
      setEnemyWinning(`You chose ${enemyChoice} and your opponent chose ${playerChoice}, so you lost2 (`);
    });
  }, []);

  return (
    <div className="App">
      <Routes>
        <Route
          path="/"
          element={(
            <Menu
              error={error}
              handleCreateRoom={handleCreateRoom}
              handleJoinRoom={handleJoinRoom}
              handleJoinRandomRoom={handleJoinRandomRoom}
            />
          )}
        />
        <Route path="/home" element={<Navigate to="/" replace />} />
        <Route
          path="/game"
          element={(
            <Game
              playerId={playerId}
              playerOneStatus={playerOneStatus}
              playerTwoStatus={playerTwoStatus}
              waiting={waiting}
              playerWinning={playerWinning}
              enemyWinning={enemyWinning}
              playerScore={playerScore}
              enemyScore={enemyScore}
              firstPlayerWon={firstPlayerWon}
              choice={choice}
              handleChoice={handleChoice}
              // handleRestart={handleRestart}
            />
          )}
        />
        <Route path="*" element={<h1>{playerId}</h1>} />
      </Routes>
    </div>
  );
}

export default App;
