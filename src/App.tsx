import { memo, useCallback, useState } from 'react';
import './App.css';

enum Player {
  X = 'X',
  O = 'O',
}

enum Status {
  Playing,
  Draw,
  Win,
}

type CellProps = {
  player: Player | '';
  handleClick: (index: number) => void;
  index: number;
};

const INITIAL_STATE = new Array<Player | ''>(9).fill('');

const WINNING_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const Cell = memo(({ player, handleClick, index }: CellProps) => (
  <div className="cell" onClick={() => handleClick(index)}>
    {player}
  </div>
));

Cell.displayName = 'Cell';

function App() {
  const [turn, setTurn] = useState<Player>(Player.X);
  const [cells, setCells] = useState<(Player | '')[]>(() => INITIAL_STATE);
  const [status, setStatus] = useState<Status>(Status.Playing);
  const [score, setScore] = useState<Record<Player, number>>(() => ({
    [Player.X]: 0,
    [Player.O]: 0,
  }));

  const handleClick = useCallback(
    (index: number) => {
      if (status !== Status.Playing) return;

      if (cells[index] === '') {
        const draft = [...cells];

        draft[index] = turn;

        const hasWon = WINNING_COMBINATIONS.some(combination => combination.every(cell => draft[cell] === turn));
        if (hasWon) {
          setStatus(Status.Win);
          setScore(score => ({
            ...score,
            [turn]: score[turn] + 1,
          }));
        } else if (!draft.some(cell => cell === '')) setStatus(Status.Draw);

        setTurn(turn === Player.X ? Player.O : Player.X);
        setCells(draft);
      }
    },
    [cells, status, turn]
  );

  const handleReset = useCallback(() => {
    setCells(INITIAL_STATE);
    setStatus(Status.Playing);
    setTurn(Player.X);
  }, []);

  return (
    <main>
      <section>
        <p>Turn: {turn}</p>
        <p>
          X Winner: {score[Player.X]}, O Winner: {score[Player.O]}
        </p>
      </section>
      <div className="board">
        {cells.map((cell, index) => (
          <Cell player={cell} key={index} index={index} handleClick={handleClick} />
        ))}
      </div>
      {status !== Status.Playing && (
        <section>
          <article role="alert">
            {status === Status.Win && `${turn === Player.O ? 'X' : 'O'} is the winner!`}
            {status === Status.Draw && 'Draw!'}
          </article>
          <button className="reset-btn" type="button" onClick={handleReset}>
            Reset
          </button>
        </section>
      )}
    </main>
  );
}

export default App;
