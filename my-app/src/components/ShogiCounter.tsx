import React, { useState, useEffect } from 'react';
import './ShogiCounter.css';

interface Game {
  id: number;
  moves: number;
}

const ShogiCounter: React.FC = () => {
  const [games, setGames] = useState<Game[]>(() => {
    const storedGames = localStorage.getItem('shogi-games');
    return storedGames ? JSON.parse(storedGames) : [];
  });      
  const [totalMoves, setTotalMoves] = useState<number>(0);
  const [currentGame, setCurrentGame] = useState<Game | null>(null);

  useEffect(() => {
    localStorage.setItem('shogi-games', JSON.stringify(games));
    setTotalMoves(games.reduce((total, game) => total + game.moves, 0));
    setCurrentGame(games.length > 0 ? games[games.length - 1] : null);
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

  const resetAllGames = () => {
    setGames([]);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (currentGame === null) return;

      if (e.code === 'Space') {
        currentGame.moves++;
      } else if (e.code === 'ArrowLeft') {
        currentGame.moves = Math.max(currentGame.moves - 1, 0);
      } else if (e.code === 'ArrowRight') {
        currentGame.moves++;
      } else {
        return;
      }
      setGames([...games]);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [games, currentGame]);

  return (
    <div className="shogi-counter">
      <h1>将棋の手数カウンター</h1>
      <div className="container">
        <div className="button-container">
          <button onClick={addGame}>新しい局を追加</button>
          <button onClick={resetAllGames}>全ての局数情報を初期化</button>
          {currentGame && (
            <button onClick={resetLatestGame}>現在の局の手数を0にする</button>
          )}
        </div>
        {currentGame && (
          <div className="current-game">
            <h2>現在の局: {currentGame.id}</h2>
            <p>手数: {currentGame.moves}</p>
          </div>
        )}
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
                    onChange={(e) => updateMoves(index, Number(e.target.value))}
                  />
                </td>
                </tr>
            ))}
          </tbody>
        </table>
        <div className="total-moves">
          <h2>総手数: {totalMoves}</h2>
        </div>
      </div>
    </div>
  );

};

export default ShogiCounter;