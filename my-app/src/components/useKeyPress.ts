// useKeyPress.ts
import { useEffect, useState } from 'react';

export const useKeyPress = (targetKey: string) => {
  const [keyPressed, setKeyPressed] = useState(false);

  const downHandler = ({ code }: KeyboardEvent) => {
    if (code === targetKey) {
      setKeyPressed(true);
    }
  };

  const upHandler = ({ code }: KeyboardEvent) => {
    if (code === targetKey) {
      setKeyPressed(false);
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', downHandler);
    window.addEventListener('keyup', upHandler);

    return () => {
      window.removeEventListener('keydown', downHandler);
      window.removeEventListener('keyup', upHandler);
    };
  }, []);

  return keyPressed;
};
