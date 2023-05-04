import React, { useState, useEffect, ChangeEvent, KeyboardEvent } from 'react';
import './ShogiCounter.css';

type Game = {
  moves: number;
};

const ShogiCounter: React.FC = () => {
  const [games, setGames] = useState<Game[]>(JSON.parse(localStorage.getItem('games') || '[]'));

  useEffect(() => {
    localStorage.setItem('games', JSON.stringify(games));
  }, [games]);

  const addGame = () => {
    if (games.length < 100) {
      setGames([...games, { moves: 0 }]);
    }
  };

  const reset = () => {
    localStorage.removeItem('games');
    setGames([]);
  };

  const resetLatestMove = () => {
    if (games.length > 0) {
      const updatedGames = [...games];
      updatedGames[updatedGames.length - 1].moves = 0;
      setGames(updatedGames);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const updatedGames = [...games];
    updatedGames[index].moves = parseInt(e.target.value) || 0;
    setGames(updatedGames);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (games.length === 0) return;
    const latestGame = games[games.length - 1];

    if (e.code === 'Space') {
      latestGame.moves++;
    } else if (e.code === 'ArrowLeft') {
      latestGame.moves = Math.max(latestGame.moves - 1, 0);
    } else if (e.code === 'ArrowRight') {
      latestGame.moves++;
    } else {
      return;
    }
    setGames([...games]);
  };

  return (
    <div className="shogi-counter" onKeyDown={handleKeyDown} tabIndex={0}>
      <h1>将棋の手数カウンター</h1>
      <div className="container">
        <div className="actions">
          <button onClick={addGame}>局追加</button>
          <button onClick={reset}>リセット</button>
          <button onClick={resetLatestMove}>最新局の手数を0にする</button>
        </div>
        <table>
          <thead>
            <tr>
              <th>局</th>
              <th>手数</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {games.map((game, i) => (
              <tr key={i}>
                <td>{i + 1}</td>
                <td>{game.moves}</td>
                <td>
                  <input
                    type="number"
                    value={game.moves}
                    onChange={(e) => handleInputChange(e, i)}
                    min={0}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p>総手数: {games.reduce((sum, game) => sum + game.moves, 0)}</p>
        <p>現在の局: {games.length}</p>
      </div>
    </div>
  );
};

export default ShogiCounter;