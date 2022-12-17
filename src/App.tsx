import { io } from 'socket.io-client';
import './App.scss';
import Menu from './components/Menu';

const socket = io(
  'http://localhost:3001',
);

function App() {
  return (
    <div className="App">
      <Menu />
      {socket.id}
    </div>
  );
}

export default App;
