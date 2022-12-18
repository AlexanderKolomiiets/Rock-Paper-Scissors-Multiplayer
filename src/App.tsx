import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import './App.scss';
import Menu from './components/Menu';
import Game from './components/Game';

const socket = io(
  'http://localhost:3001',
);

function App() {
  const [playerId, setPlayerId] = useState(0);
  const [playerStatus, setPlayerStatus] = useState(0);

  const handlePlayerNumber = (id: number) => {
    if (id === 1) {
      setPlayerId(1);
    } else {
      setPlayerId(2);
    }
  };

  const handlePlayerJoined = (id: number) => {
    if (id === 1) {
      setPlayerStatus(1);
    } else {
      setPlayerStatus(2);
    }
  };

  return (
    <div className="App">
      {socket.id}
      <Routes>
        <Route path="/" element={<Menu />} />
        <Route path="/home" element={<Navigate to="/" replace />} />
        <Route
          path="/game"
          element={<Game playerId={playerId} playerStatus={playerStatus} />}
        />
        <Route path="*" element={<h1>Page not found</h1>} />
      </Routes>
    </div>
  );
}

export default App;
