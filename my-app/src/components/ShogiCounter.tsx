import React, { useState, useEffect } from 'react';
import './ShogiCounter.css';

interface Game {
  id: number;
  moves: number;
}

const ShogiCounter: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [totalMoves, setTotalMoves] = useState<number>(0);

  useEffect(() => {
    const storedGames = localStorage.getItem('shogi-games');
    if (storedGames) {
      setGames(JSON.parse(storedGames));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('shogi-games', JSON.stringify(games));
    setTotalMoves(games.reduce((total, game) => total + game.moves, 0));
  }, [games]);

  const addGame = () => {
    const newGame: Game = {
      id: games.length + 1,
      moves: 0,
    };
    setGames([...games, newGame]);
  };

  const updateMoves = (index: number, moves: number) => {
    games[index].moves = moves;
    setGames([...games]);
  };

  const resetLatestGame = () => {
    if (games.length === 0) return;
    games[games.length - 1].moves = 0;
    setGames([...games]);
  };

  useEffect(() => {
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

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [games]);

  return (
    <div className="shogi-counter">
      <h1>将棋の手数カウンター</h1>
      <div className="container">
        <button onClick={addGame}>新しい局を追加</button>
        <div className="actions">
          <button onClick={resetLatestGame}>最新の局の手数を0にする</button>
        </div>
        <table>
          <thead>
            <tr>
              <th>局</th>
              <th>手数</th>
            </tr>
          </thead>
          <tbody>
            {games.map((game, index) => (
              <tr key={game.id}>
                <td>{game.id}</td>
                <td>
                  <input
                    type="number"
                    value={game.moves}
                    onChange={(e) => updateMoves(index, parseInt(e.target.value))}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p>総手数: {totalMoves}</p>
      </div>
    </div>
  );
};

export default ShogiCounter;
