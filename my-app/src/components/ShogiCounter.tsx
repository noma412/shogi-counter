// ShogiCounter.tsx
import React, { useState, useEffect } from 'react';
import './ShogiCounter.css';
import { useKeyPress } from './useKeyPress';

type Game = {
  moves: number;
};

const ShogiCounter: React.FC = () => {
  const [games, setGames] = useState<Game[]>(() => {
    const savedGames = localStorage.getItem('games');
    return savedGames ? JSON.parse(savedGames) : [];
  });

  const totalMoves = games.reduce((sum, game) => sum + game.moves, 0);
  const currentGame = games.length;

  const spacePressed = useKeyPress('Space');
  const arrowLeftPressed = useKeyPress('ArrowLeft');
  const arrowRightPressed = useKeyPress('ArrowRight');

  useEffect(() => {
    localStorage.setItem('games', JSON.stringify(games));
  }, [games]);

  useEffect(() => {
    if (games.length === 0) return;

    const latestGameIndex = games.length - 1;
    const updatedGames = [...games];

    if (spacePressed || arrowRightPressed) {
      updatedGames[latestGameIndex].moves++;
    } else if (arrowLeftPressed) {
      updatedGames[latestGameIndex].moves = Math.max(updatedGames[latestGameIndex].moves - 1, 0);
    } else {
      return;
    }

    setGames(updatedGames);
  }, [spacePressed, arrowLeftPressed, arrowRightPressed]);

  const updateMoves = (index: number, newMoves: number) => {
    const updatedGames = [...games];
    updatedGames[index].moves = newMoves;
    setGames(updatedGames);
  };

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

  const getStoredGames = () => {
    const storedGames = localStorage.getItem('games');
    return storedGames ? JSON.parse(storedGames) : [];
  };
  
  return (
    <div className="ShogiCounter">
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
                    className="move-input"
                    min={0}
                    onChange={(e) =>
                      updateMoves(i, parseInt(e.target.value) || 0)
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p>総手数: {totalMoves}</p>
        <p>現在の局: {currentGame}</p>
      </div>
    </div>
  );
};

export default ShogiCounter;
