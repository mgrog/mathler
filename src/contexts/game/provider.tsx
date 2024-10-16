import { PropsWithChildren, useEffect, useReducer } from 'react';

import problems from '@problems';
import { produce } from 'immer';

import { GameContext } from '@contexts/game/context';
import {
  evaluateExpression,
  generateCommutativeReorderings,
} from '@contexts/game/util';
import { entryArrayToExpression, expressionToArray } from '@utils/helpers';

export const MAX_GUESSES = 6;

export type GameAction =
  | {
      type: 'ADD_VALUE';
      value: string;
    }
  | {
      type: 'REMOVE_VALUE';
    }
  | {
      type: 'RESET_GAME';
    }
  | {
      type: 'CHECK_ANSWER';
    };

export type BadEntryError = 'wrong_size' | 'wrong_sum';
export type BadFormatError = 'leading_zeroes' | 'divide_by_zero';

export interface IGameContext {
  boardState: string[][]; // 2D array representing the board state
  dispatch: (action: GameAction) => void; // Function to dispatch actions to the reducer
  solution: string; // The correct math solution
  cursor: { row: number; col: number }; // The current cursor position
  enteredAnswers: string[][]; // The users answers
  commutativeReorderings: string[][]; // These are all the possible commutative reorderings of the problem
  winStatus: 'exact_win' | 'commutative_win' | 'lose' | 'playing'; // The current win status
  error: {
    status: BadEntryError | BadFormatError;
  } | null;
}

export type GameState = Omit<IGameContext, 'dispatch'>;
type GameEntryStatus =
  | 'exact_correct'
  | 'commutative_correct'
  | 'incorrect'
  | 'wrong_sum'
  | 'wrong_size'
  | 'leading_zeroes'
  | 'divide_by_zero';

export function getRandomProblem() {
  const randomIndex = Math.floor(Math.random() * problems.length);
  return problems[randomIndex];
}

export function newBoard(solution: string) {
  const p = expressionToArray(solution);
  return Array.from({ length: MAX_GUESSES }, () =>
    Array.from({ length: p.length }, () => ''),
  );
}

export function nextCursor(
  boardState: string[][],
  cursor: { row: number; col: number },
) {
  const endOfRow = boardState[0].length;
  const { row, col } = cursor;
  if (cursor.col === endOfRow) return cursor;

  return { row, col: col + 1 };
}

export function prevCursor(cursor: { row: number; col: number }) {
  const { row, col } = cursor;
  if (cursor.col === 0) return cursor;
  return { row, col: col - 1 };
}

export function resetGame(initState?: GameState): GameState {
  if (initState) return initState;
  const newProblem = getRandomProblem();
  return {
    winStatus: 'playing',
    cursor: { row: 0, col: 0 },
    boardState: newBoard(newProblem),
    solution: newProblem,
    enteredAnswers: [],
    commutativeReorderings: Array.from(
      generateCommutativeReorderings(newProblem),
    ).map(expressionToArray),
    error: null,
  };
}

export function checkFormat(entryExpr: string): BadFormatError | 'format_ok' {
  if (/\b0\d+\b/g.test(entryExpr)) return 'leading_zeroes';
  if (/\/\s0\b/g.test(entryExpr)) return 'divide_by_zero';
  return 'format_ok';
}

export function checkAnswer(
  entry: string[],
  target: string[],
  targetCommutativeReorderings: string[][],
): GameEntryStatus {
  const entryExpr = entryArrayToExpression(entry);
  const targetExpr = entryArrayToExpression(target);
  if (entry.length !== target.length) return 'wrong_size';

  const formatCheck = checkFormat(entryExpr);
  if (formatCheck !== 'format_ok') return formatCheck;

  const targetSum = evaluateExpression(entryExpr);
  const enteredSum = evaluateExpression(targetExpr);

  if (enteredSum !== targetSum) return 'wrong_sum';
  if (entryExpr === targetExpr) return 'exact_correct';
  for (const commutativeReordering of targetCommutativeReorderings) {
    if (entryExpr === entryArrayToExpression(commutativeReordering)) {
      return 'commutative_correct';
    }
  }
  return 'incorrect';
}

function reducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'ADD_VALUE': {
      if (state.winStatus !== 'playing') return state;
      return produce(state, (draft) => {
        if (state.cursor.col >= draft.boardState[0].length) return;
        if (state.cursor.row >= draft.boardState.length) return;
        draft.boardState[state.cursor.row][state.cursor.col] = action.value;
        draft.cursor = nextCursor(draft.boardState, state.cursor);
      });
    }

    case 'CHECK_ANSWER': {
      const { cursor } = state;
      const currRow = state.boardState[cursor.row].filter(Boolean);
      const answer = checkAnswer(
        currRow,
        expressionToArray(state.solution),
        state.commutativeReorderings,
      );
      return produce(state, (draft) => {
        draft.error = null;
        switch (answer) {
          case 'exact_correct': {
            draft.enteredAnswers.push(currRow);
            draft.winStatus = 'exact_win';
            break;
          }
          case 'commutative_correct': {
            draft.enteredAnswers.push(currRow);
            draft.winStatus = 'commutative_win';
            break;
          }
          case 'incorrect': {
            draft.enteredAnswers.push(currRow);
            draft.cursor = { row: cursor.row + 1, col: 0 };
            if (draft.enteredAnswers.length >= MAX_GUESSES) {
              draft.winStatus = 'lose';
            }
            break;
          }
          case 'wrong_size':
          case 'wrong_sum':
          case 'leading_zeroes':
          case 'divide_by_zero':
            draft.error = { status: answer };
            break;
          default: {
            const _exhaustiveCheck: never = answer;
          }
        }
      });
    }

    case 'REMOVE_VALUE': {
      if (state.winStatus !== 'playing') return state;
      return produce(state, (draft) => {
        const cursor = prevCursor(state.cursor);
        draft.boardState[cursor.row][cursor.col] = '';
        draft.cursor = cursor;
      });
    }

    case 'RESET_GAME': {
      return resetGame();
    }

    default:
      const _exhaustiveCheck: never = action;
      return state;
  }
}

interface GameContextProviderProps {
  initState?: GameState;
}

export const GameContextProvider = ({
  children,
  initState,
}: PropsWithChildren<GameContextProviderProps>) => {
  const [gameState, dispatch] = useReducer(reducer, {} as GameState, () =>
    resetGame(initState),
  );
  useEffect(() => {
    console.log('Psst, the solution is:', gameState.solution);
  }, [gameState.solution]);

  return (
    <GameContext.Provider value={{ ...gameState, dispatch }}>
      {children}
    </GameContext.Provider>
  );
};
