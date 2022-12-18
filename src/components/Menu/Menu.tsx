import 'bulma/css/bulma.min.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const Menu: React.FC = () => {
  const [selected, setSelected] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleSelect = (section: string | null) => {
    setSelected(section);
  };

  const buttonLayoutStyles = {
    display: 'flex',
    gap: '30px',
    justifyContent: 'center',
  };

  return (
    <div>
      <h1 className="title is-3">Rock Paper Scissors</h1>

      {!selected && (
        <div style={buttonLayoutStyles}>
          <button
            type="submit"
            className="button is-primary"
            onClick={() => navigate('/game')}
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
          />
          <div style={buttonLayoutStyles}>
            <button type="submit" className="button is-primary">
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
          />
          <div style={buttonLayoutStyles}>
            <button type="submit" className="button is-primary">
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

          <button type="submit" className="button is-primary">
            Join Random
          </button>
        </div>
      )}

      <div className="error-message" id="error-message" />
    </div>
  );
};
