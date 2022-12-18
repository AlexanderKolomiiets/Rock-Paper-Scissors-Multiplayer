import 'bulma/css/bulma.min.css';
import './Game.scss';
import classNames from 'classnames';
import rock from '../../images/rock.png';
import paper from '../../images/paper.png';
import scissors from '../../images/scissors.png';

type Props = {
  playerId: number,
  playerStatus: number,
};

export const Game: React.FC<Props> = ({ playerId, playerStatus }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: '20px',
      }}
    >
      <div className="title">
        <p>Waiting for another player to join...</p>
      </div>

      <div
        className="block"
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '20px',
        }}
      >
        <div className="player">
          <span className={classNames(
            'dot',
            { connected: playerStatus === 1 },
          )}
          />
          <span className="subtitle" id="player-1-tag">
            {playerId === 1
              ? 'You (Player 1)'
              : 'Enemy (Player 2)'}
          </span>
        </div>

        <div className="player">
          <span className={classNames(
            'dot',
            { connected: playerStatus === 2 },
          )}
          />
          <span className="subtitle" id="player-2-tag">
            {playerId === 1
              ? 'Enemy (Player 2)'
              : 'You (Player 1)'}
          </span>
        </div>
      </div>

      <div className="choices block" style={{ display: 'flex', gap: '20px' }}>
        <div className="choice">
          <img src={rock} alt="rock" />
        </div>

        <div className="choice">
          <img src={paper} alt="paper" />
        </div>

        <div className="choice">
          <img src={scissors} alt="scissors" />
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
        <span className="tag is-link is-normal">
          You:
          <span id="my-score" style={{ marginLeft: '5px' }}>
            0
          </span>
        </span>
        <span className="tag is-link is-normal">
          Enemy:
          <span id="enemy-score" style={{ marginLeft: '5px' }}>
            0
          </span>
        </span>
      </div>

      <div className="message-after-choice-selection" />
    </div>
  );
};
