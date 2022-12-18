import { Routes, Route, Navigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import './App.scss';
import Menu from './components/Menu';
import Game from './components/Game';

const socket = io(
  'http://localhost:3001',
);

function App() {
  return (
    <div className="App">
      {socket.id}
      <Routes>
        <Route path="/" element={<Menu />} />
        <Route path="/home" element={<Navigate to="/" replace />} />
        <Route path="/game" element={<Game />} />
        <Route path="*" element={<h1>Page not found</h1>} />
      </Routes>
    </div>
  );
}

export default App;
