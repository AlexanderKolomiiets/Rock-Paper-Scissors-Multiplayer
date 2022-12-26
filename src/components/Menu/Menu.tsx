import 'bulma/css/bulma.min.css';
import { ChangeEvent, useEffect, useState } from 'react';
import classNames from 'classnames';
import { Error } from '../../../types/Error';

type Props = {
  error: Error | null;
  handleCreateRoom: (value: string, name: string) => void;
  handleJoinRoom: (value: string, name: string) => void;
  handleJoinRandomRoom: (name: string) => void;
};

export const Menu: React.FC<Props> = ({
  error,
  handleCreateRoom,
  handleJoinRoom,
  handleJoinRandomRoom,
}) => {
  const [selected, setSelected] = useState<string | null>(null);
  const [createInput, setCreateInput] = useState('');
  const [joinInput, setJoinInput] = useState('');
  const [playerOneName, setPlayerOneName] = useState('');
  const [playerTwoName, setPlayerTwoName] = useState('');

  useEffect(() => {
    setPlayerOneName(JSON.parse(localStorage.getItem('playerOneName')
      || '[]'));
    setPlayerTwoName(JSON.parse(localStorage.getItem('playerTwoName')
      || '[]'));
  }, []);

  const handleSelect = (section: string | null) => {
    setSelected(section);
  };

  const handleCreateInput = (event: ChangeEvent<HTMLInputElement>) => {
    setCreateInput(event.target.value);
  };

  const handleJoinInput = (event: ChangeEvent<HTMLInputElement>) => {
    setJoinInput(event.target.value);
  };

  const handlePlayerOneName = (event: ChangeEvent<HTMLInputElement>) => {
    setPlayerOneName(event.target.value);
  };

  const handlePlayerTwoName = (event: ChangeEvent<HTMLInputElement>) => {
    setPlayerTwoName(event.target.value);
  };

  const handleSubmitCreate = () => {
    if (createInput && playerOneName) {
      handleCreateRoom(createInput, playerOneName);
      localStorage.setItem(
        'playerOneName', JSON.stringify(playerOneName),
      );
      setCreateInput('');
      setPlayerOneName('');
    }
  };

  const handleSubmitJoin = () => {
    if (joinInput && playerTwoName) {
      handleJoinRoom(joinInput, playerTwoName);
      localStorage.setItem(
        'playerTwoName', JSON.stringify(playerTwoName),
      );
      setJoinInput('');
      setPlayerTwoName('');
    }
  };

  const handleSubmitJoinRandom = () => {
    if (playerTwoName) {
      handleJoinRandomRoom(playerTwoName);
      localStorage.setItem(
        'playerTwoName', JSON.stringify(playerTwoName),
      );
      setJoinInput('');
      setPlayerTwoName('');
    }
  };

  const mainMenuStyles = {
    display: 'flex',
    gap: '30px',
    justifyContent: 'center',
  };

  const errorStyles = {
    width: '300px',
    margin: '0 auto',
    marginTop: '40px',
    display: 'block',
    background: '#cc0000',
    color: 'white',
    padding: '10px',
  };

  return (
    <div>
      <h1 className="title is-3">Rock Paper Scissors</h1>

      {!selected && (
        <div style={mainMenuStyles}>
          <button
            type="submit"
            className="button is-primary"
            onClick={() => handleSelect('create')}
          >
            Create Room
          </button>
          <button
            type="submit"
            className="button is-primary"
            onClick={() => handleSelect('join')}
          >
            Join Room
          </button>
        </div>
      )}

      {selected === 'create' && (
        <div>
          <input
            type="text"
            placeholder="Enter a name of the room"
            className="input"
            style={{ marginBottom: '30px' }}
            value={createInput}
            onChange={handleCreateInput}
          />
          <input
            type="text"
            placeholder="Enter you nickname"
            className="input"
            style={{ marginBottom: '30px' }}
            value={playerOneName}
            onChange={handlePlayerOneName}
          />
          <div style={mainMenuStyles}>
            <button
              type="submit"
              className="button is-primary"
              onClick={handleSubmitCreate}
            >
              Create
            </button>

            <button
              type="submit"
              className="button is-light"
              onClick={() => handleSelect(null)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {selected === 'join' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          <input
            type="text"
            className="input"
            placeholder="Enter a name of the room"
            value={joinInput}
            onChange={handleJoinInput}
          />
          <input
            type="text"
            placeholder="Enter you nickname"
            className="input"
            value={playerTwoName}
            onChange={handlePlayerTwoName}
          />
          <div style={mainMenuStyles}>
            <button
              type="submit"
              className="button is-primary"
              onClick={handleSubmitJoin}
            >
              Join
            </button>

            <button
              type="submit"
              className="button is-light"
              onClick={() => handleSelect(null)}
            >
              Cancel
            </button>
          </div>

          <button
            type="submit"
            className="button is-primary"
            onClick={handleSubmitJoinRandom}
          >
            Join Random
          </button>
        </div>
      )}

      <p
        className={classNames('error', { 'is-hidden': !error })}
        style={errorStyles}
      >
        {error}
      </p>
    </div>
  );
};
