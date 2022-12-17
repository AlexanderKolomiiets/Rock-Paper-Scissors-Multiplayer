import './App.scss';
import { io } from 'socket.io-client';

const socket = io(
  'http://localhost:3001',
);

function App() {
  return (
    <div className="App">
      <h1>hello</h1>
      <h1>{socket.id}</h1>
    </div>
  );
}

export default App;
