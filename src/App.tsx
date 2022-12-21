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
  const [winning, setWinning] = useState<null | string>(null);
  const [roomId, setRoomId] = useState(0);
  const [canChoose, setCanChoose] = useState(false);
  const [playerScore, setPlayerScore] = useState(0);
  const [enemyScore, setEnemyScore] = useState(0);
  const [error, setError] = useState<null | Error>(null);

  const navigate = useNavigate();

  const handlePlayerJoined = (id: number) => {
    if (id === 1) {
      setPlayerOneStatus(true);
    } else {
      setPlayerTwoStatus(true);
    }
  };

  const handleChoice = (item: Choice) => {
    if (canChoose && playerOneStatus && playerTwoStatus) {
      setChoice(item);
      socket.emit('choose', { playerId, choice, roomId });
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
      handlePlayerJoined(1);
      if (!error) {
        navigate('/game');
      }

      setWaiting(false);
    });

    socket.on('player_1_connected', () => {
      handlePlayerJoined(1);
    });

    socket.on('player_2_connected', () => {
      handlePlayerJoined(2);
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
      setWinning(message);
    });

    socket.on('player_1_wins', ({ playerChoice, enemyChoice }) => {
      if (playerId === 1) {
        setWinning(`You chose ${playerChoice} and you opponent chose ${enemyChoice}, so you won )`);
        setPlayerScore(prev => prev + 1);
      } else {
        setWinning(`You chose ${playerChoice} and you opponent chose ${enemyChoice}, so you lost (`);
        setEnemyScore(prev => prev + 1);
      }
    });

    socket.on('player_2_wins', ({ playerChoice, enemyChoice }) => {
      if (playerId === 2) {
        setWinning(`You chose ${playerChoice} and you opponent chose ${enemyChoice}, so you won )`);
        setPlayerScore(prev => prev + 1);
      } else {
        setWinning(`You chose ${playerChoice} and you opponent chose ${enemyChoice}, so you lost (`);
        setEnemyScore(prev => prev + 1);
      }
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
              winning={winning}
              playerScore={playerScore}
              enemyScore={enemyScore}
              choice={choice}
              handleChoice={handleChoice}
            />
          )}
        />
        <Route path="*" element={<h1>Page not found</h1>} />
      </Routes>
    </div>
  );
}

export default App;
