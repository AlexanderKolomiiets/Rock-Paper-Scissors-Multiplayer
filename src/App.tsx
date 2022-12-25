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

const socket = io('https://rock-paper-scissors-multiplayer.onrender.com',
  { transports: ['websocket', 'polling', 'flashsocket'] });

function App() {
  const [playerId, setPlayerId] = useState(0);
  const [roomId, setRoomId] = useState(0);
  const [playerOneStatus, setPlayerOneStatus] = useState(false);
  const [playerTwoStatus, setPlayerTwoStatus] = useState(false);
  const [playerOneName, setPlayerOneName] = useState('');
  const [playerTwoName, setPlayerTwoName] = useState('');
  const [waiting, setWaiting] = useState(true);
  const [playerWinning, setPlayerWinning] = useState<null | string>(null);
  const [enemyWinning, setEnemyWinning] = useState<null | string>(null);
  const [choice, setChoice] = useState<null | Choice>(null);
  const [canChoose, setCanChoose] = useState(false);
  const [playerScore, setPlayerScore] = useState(0);
  const [enemyScore, setEnemyScore] = useState(0);
  const [firstPlayerWon, setFirstPlayerWon] = useState(false);
  const [playerOneChose, setPlayerOneChose] = useState(false);
  const [playerTwoChose, setPlayerTwoChose] = useState(false);
  const [error, setError] = useState<null | Error>(null);

  const navigate = useNavigate();

  const handleChoice = (item: Choice) => {
    if (canChoose && playerOneStatus && playerTwoStatus) {
      const playerChoice = item;

      setChoice(item);
      socket.emit('choose', { playerId, playerChoice, roomId });
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

  const handleRestart = () => {
    socket.emit('restart', roomId);
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
      setPlayerOneStatus(true);
      if (!error) {
        navigate('/game');
      }
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
      navigate('/');
      setPlayerScore(0);
      setEnemyScore(0);
      setWaiting(true);
      setPlayerTwoChose(false);
    });

    socket.on('player_2_disconnected', () => {
      setCanChoose(false);
      setPlayerTwoStatus(false);
      setWaiting(true);
      setPlayerScore(0);
      setEnemyScore(0);
      setPlayerWinning('');
      setEnemyWinning('');
      setPlayerOneChose(false);
    });

    socket.on('player_chose', (id) => {
      if (id === 1) {
        setPlayerOneChose(true);
      } else {
        setPlayerTwoChose(true);
      }
    });

    socket.on('lock_choice', () => {
      setCanChoose(false);
      setPlayerOneChose(false);
      setPlayerTwoChose(false);
    });

    socket.on('draw', (message: string) => {
      setPlayerWinning(message);
      setEnemyWinning(message);
    });

    socket.on('player_1_wins', ({ playerOneChoice, playerTwoChoice }) => {
      setFirstPlayerWon(true);
      setPlayerWinning(`You chose ${playerOneChoice} and your opponent chose ${playerTwoChoice}, so you won )`);
      setEnemyWinning(`You chose ${playerTwoChoice} and your opponent chose ${playerOneChoice}, so you lost (`);
      setPlayerScore(prev => prev + 1);
    });

    socket.on('player_2_wins', ({ playerOneChoice, playerTwoChoice }) => {
      setFirstPlayerWon(false);
      setPlayerWinning(`You chose ${playerTwoChoice} and your opponent chose ${playerOneChoice}, so you won )`);
      setEnemyWinning(`You chose ${playerOneChoice} and your opponent chose ${playerTwoChoice}, so you lost (`);
      setEnemyScore(prev => prev + 1);
    });

    socket.on('restart', () => {
      setPlayerWinning('');
      setEnemyWinning('');
      setChoice(null);
      setCanChoose(true);
    });

    return () => {
      socket.off('show_error');
      socket.off('room_created');
      socket.off('room_joined');
      socket.off('player_1_connected');
      socket.off('player_2_connected');
      socket.off('player_1_disconnected');
      socket.off('player_2_disconnected');
      socket.off('player_chose');
      socket.off('lock_choice');
      socket.off('draw');
      socket.off('player_1_wins');
      socket.off('player_2_wins');
      socket.off('restart');
    };
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
              playerOneName={playerOneName}
              playerTwoName={playerTwoName}
              setPlayerOneName={setPlayerOneName}
              setPlayerTwoName={setPlayerTwoName}
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
              playerOneName={playerOneName}
              playerTwoName={playerTwoName}
              waiting={waiting}
              playerWinning={playerWinning}
              enemyWinning={enemyWinning}
              playerScore={playerScore}
              enemyScore={enemyScore}
              firstPlayerWon={firstPlayerWon}
              playerOneChose={playerOneChose}
              playerTwoChose={playerTwoChose}
              choice={choice}
              handleChoice={handleChoice}
              handleRestart={handleRestart}
            />
          )}
        />
        <Route path="*" element={<h1>Page not found</h1>} />
      </Routes>
    </div>
  );
}

export default App;
