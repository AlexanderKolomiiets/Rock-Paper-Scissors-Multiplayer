import 'bulma/css/bulma.min.css';
import { useState } from 'react';
import classNames from 'classnames';
import { Error } from '../../../types/Error';

type Props = {
  error: Error | null;
  handleCreateRoom: (value: string) => void;
  handleJoinRoom: (value: string) => void;
  handleJoinRandomRoom: () => void;
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

  const handleSelect = (section: string | null) => {
    setSelected(section);
  };

  const handleCreateInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCreateInput(event.target.value);
  };

  const handleJoinInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setJoinInput(event.target.value);
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
          <div style={mainMenuStyles}>
            <button
              type="submit"
              className="button is-primary"
              onClick={() => {
                handleCreateRoom(createInput);
                setCreateInput('');
              }}
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
          <div style={mainMenuStyles}>
            <button
              type="submit"
              className="button is-primary"
              onClick={() => {
                handleJoinRoom(joinInput);
                setJoinInput('');
              }}
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
            onClick={() => handleJoinRandomRoom()}
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
