/* eslint-disable no-nested-ternary */
import 'bulma/css/bulma.min.css';
import './Game.scss';
import classNames from 'classnames';
import { Choice } from '../../../types/Choice';
import rock from '../../images/rock.png';
import paper from '../../images/paper.png';
import scissors from '../../images/scissors.png';

type Props = {
  playerId: number;
  playerOneStatus: boolean;
  playerTwoStatus: boolean;
  waiting: boolean;
  playerWinning: null | string;
  enemyWinning: null | string;
  playerScore: number;
  enemyScore: number;
  firstPlayerWon: boolean;
  choice: null | Choice;
  playerOneChose: boolean;
  playerTwoChose: boolean;
  handleChoice: (item: Choice) => void;
  handleRestart: () => void;
};

export const Game: React.FC<Props> = ({
  playerId,
  playerOneStatus,
  playerTwoStatus,
  waiting,
  playerScore,
  enemyScore,
  playerWinning,
  enemyWinning,
  firstPlayerWon,
  choice,
  playerOneChose,
  playerTwoChose,
  handleChoice,
  handleRestart,
}) => {
  return (
    <div
      className="block-row"
      style={{ flexDirection: 'column' }}
    >
      <div className={classNames('title', { 'is-hidden': !waiting })}>
        <p>Waiting for another player to join...</p>
      </div>

      <div className={classNames('subtitle',
        {
          'is-hidden': (playerId === 1 && !playerTwoChose)
      || (playerId === 2 && !playerOneChose)
      || !playerId,
        })}
      >
        <p>
          Opponent made a choice
        </p>
      </div>

      <div className="block block-row" id="players">
        <div id="player-1">
          <span className={classNames('dot', { connected: playerOneStatus })} />
          <span className="subtitle">
            {playerId === 1 ? 'You (Player 1)' : 'Enemy (Player 1)'}
          </span>
        </div>

        <div id="player-2">
          <span className={classNames('dot', { connected: playerTwoStatus })} />
          <span className="subtitle">
            {playerId === 1 ? 'Enemy (Player 2)' : 'You (Player 2)'}
          </span>
        </div>
      </div>

      <div className="block-row block" id="choices">
        <div
          className={classNames('choice', { selected: choice === 'rock' })}
          onClick={() => handleChoice('rock')}
          role="presentation"
        >
          <img src={rock} alt="rock" />
        </div>

        <div
          className={classNames('choice', { selected: choice === 'paper' })}
          onClick={() => handleChoice('paper')}
          role="presentation"
        >
          <img src={paper} alt="paper" />
        </div>

        <div
          className={classNames('choice', { selected: choice === 'scissors' })}
          onClick={() => handleChoice('scissors')}
          role="presentation"
        >
          <img src={scissors} alt="scissors" />
        </div>
      </div>

      <div className="block-row" id="score">
        <span className="tag is-link is-normal">
          You:
          <span id="my-score" style={{ marginLeft: '5px' }}>
            {playerId === 1 ? playerScore : enemyScore}
          </span>
        </span>
        <span className="tag is-link is-normal">
          Enemy:
          <span id="enemy-score" style={{ marginLeft: '5px' }}>
            {playerId === 1 ? enemyScore : playerScore}
          </span>
        </span>
      </div>

      <div className={classNames(
        'title', { 'is-hidden': !playerWinning && !enemyWinning },
      )}
      >
        <p>
          {firstPlayerWon
            ? (playerId === 1 ? playerWinning : enemyWinning)
            : (playerId === 1 ? enemyWinning : playerWinning)}
        </p>
      </div>

      {playerWinning && enemyWinning
        && (
          <button
            type="submit"
            className="button is-link"
            onClick={handleRestart}
          >
            Restart
          </button>
        )}
    </div>
  );
};
