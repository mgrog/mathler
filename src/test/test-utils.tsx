import {
  GameContextProvider,
  GameState,
  newBoard,
} from '@contexts/game/provider';
import { generateCommutativeReorderings } from '@contexts/game/util';
import '@testing-library/jest-dom';
import { cleanup, render } from '@testing-library/react';
import { expressionToArray } from '@utils/helpers';
import { afterEach } from 'vitest';

afterEach(() => {
  cleanup();
});

const customRender = (ui: React.ReactElement, options = {}) =>
  render(ui, {
    wrapper: ({ children }) => (
      <GameContextProvider>{children}</GameContextProvider>
    ),
    ...options,
  });

const renderInitialized = (ui: React.ReactElement, options = {}) => {
  const testSolution = '2+8-3';
  const testState: GameState = {
    winStatus: 'playing',
    cursor: { row: 0, col: 0 },
    boardState: newBoard(testSolution),
    solution: testSolution,
    enteredAnswers: [],
    commutativeReorderings: Array.from(
      generateCommutativeReorderings(testSolution),
    ).map(expressionToArray),
    error: null,
  };

  return render(ui, {
    wrapper: ({ children }) => (
      <GameContextProvider initState={testState}>
        {children}
      </GameContextProvider>
    ),
    ...options,
  });
};

export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';

export { customRender as render, renderInitialized };
