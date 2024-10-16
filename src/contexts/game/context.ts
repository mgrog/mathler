import { IGameContext } from '@contexts/game/provider';
import { createContext, useContext } from 'react';

export const GameContext = createContext<IGameContext>({
  boardState: [],
  dispatch: () => {},
  solution: '',
  cursor: { row: 0, col: 0 },
  enteredAnswers: [],
  commutativeReorderings: [],
  winStatus: 'playing',
  error: null,
});

export const useGameContext = () => useContext(GameContext);
