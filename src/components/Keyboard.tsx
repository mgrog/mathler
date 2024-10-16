import { useEffect, useMemo, useState } from 'react';

import { cn } from '@utils';

import { useGameContext } from '@contexts/game/context';
import { useGetKeyStatus } from '@hooks/useGetKeyStatus';

export function Keyboard() {
  const btnClass =
    'flex items-center justify-center w-[40px] h-[50px] rounded bg-white border-2 border-slate-300 text-black text-lg font-bold transition duration-100 ease-in-out';
  const btnActiveClass = 'bg-slate-200 translate-y-[2px]';
  const btnMouseActiveClass = 'active:bg-slate-200 active:translate-y-[2px]';
  const btnCorrectClass = 'bg-green-500 border-green-500 text-white';
  const btnIncorrectClass = 'bg-[#727F93] border-[#727F93] text-white';
  const btnWrongPositionClass = 'bg-[#E2B53F] border-[#E2B53F] text-white';

  const { dispatch, boardState } = useGameContext();
  const [keysPressed, setKeysPressed] = useState({} as Record<string, boolean>);
  const addValue = (value: string) => {
    dispatch({ type: 'ADD_VALUE', value });
  };
  const onEnter = () => {
    dispatch({ type: 'CHECK_ANSWER' });
  };
  const onDelete = () => {
    dispatch({ type: 'REMOVE_VALUE' });
  };

  useEffect(() => {
    const onKeyDown = (e: React.KeyboardEvent | KeyboardEvent) => {
      if (e.repeat) return;

      setKeysPressed((prev) => ({ ...prev, [e.key]: true }));
      if (e.key === 'Enter') {
        onEnter();
      } else if (e.key === 'Backspace') {
        onDelete();
      } else if (e.key === 'Escape') {
        // clear pressed values if stuck
        setKeysPressed({});
      } else if (
        e.key === '0' ||
        e.key === '1' ||
        e.key === '2' ||
        e.key === '3' ||
        e.key === '4' ||
        e.key === '5' ||
        e.key === '6' ||
        e.key === '7' ||
        e.key === '8' ||
        e.key === '9' ||
        e.key === '+' ||
        e.key === '-' ||
        e.key === '*' ||
        e.key === '/'
      ) {
        addValue(e.key);
      }
    };

    const onKeyUp = (e: React.KeyboardEvent | KeyboardEvent) => {
      setKeysPressed((prev) => ({ ...prev, [e.key]: false }));
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getKeyStatus = useGetKeyStatus();
  const statusPrecedence = {
    correct: 2,
    incorrect: 2,
    wrong_position: 1,
    empty: 0,
  };
  const statusByKey = useMemo(() => {
    const statusByKey: Record<
      string,
      'empty' | 'correct' | 'incorrect' | 'wrong_position'
    > = {};
    for (let row = 0; row < boardState.length; row += 1) {
      for (let col = 0; col < boardState[row].length; col += 1) {
        const currStatus = statusByKey[boardState[row][col]];
        const nextStatus = getKeyStatus(row, col, boardState[row][col]);
        if (
          !currStatus ||
          statusPrecedence[nextStatus] > statusPrecedence[currStatus]
        ) {
          statusByKey[boardState[row][col]] = nextStatus;
        }
      }
    }
    return statusByKey;
  }, [boardState, getKeyStatus]);

  return (
    <div data-testid="keyboard">
      <div className="mb-1 flex items-center justify-center gap-1">
        <button
          data-testid="keyboard-key-0"
          className={cn(btnClass, btnMouseActiveClass, {
            [btnActiveClass]: keysPressed['0'],
            [btnCorrectClass]: statusByKey['0'] === 'correct',
            [btnIncorrectClass]: statusByKey['0'] === 'incorrect',
            [btnWrongPositionClass]: statusByKey['0'] === 'wrong_position',
          })}
          onClick={() => addValue('0')}
        >
          0
        </button>
        <button
          data-testid="keyboard-key-1"
          className={cn(btnClass, btnMouseActiveClass, {
            [btnActiveClass]: keysPressed['1'],
            [btnCorrectClass]: statusByKey['1'] === 'correct',
            [btnIncorrectClass]: statusByKey['1'] === 'incorrect',
            [btnWrongPositionClass]: statusByKey['1'] === 'wrong_position',
          })}
          onClick={() => addValue('1')}
        >
          1
        </button>
        <button
          data-testid="keyboard-key-2"
          className={cn(btnClass, btnMouseActiveClass, {
            [btnActiveClass]: keysPressed['2'],
            [btnCorrectClass]: statusByKey['2'] === 'correct',
            [btnIncorrectClass]: statusByKey['2'] === 'incorrect',
            [btnWrongPositionClass]: statusByKey['2'] === 'wrong_position',
          })}
          onClick={() => addValue('2')}
        >
          2
        </button>
        <button
          data-testid="keyboard-key-3"
          className={cn(btnClass, btnMouseActiveClass, {
            [btnActiveClass]: keysPressed['3'],
            [btnCorrectClass]: statusByKey['3'] === 'correct',
            [btnIncorrectClass]: statusByKey['3'] === 'incorrect',
            [btnWrongPositionClass]: statusByKey['3'] === 'wrong_position',
          })}
          onClick={() => addValue('3')}
        >
          3
        </button>
        <button
          data-testid="keyboard-key-4"
          className={cn(btnClass, btnMouseActiveClass, {
            [btnActiveClass]: keysPressed['4'],
            [btnCorrectClass]: statusByKey['4'] === 'correct',
            [btnIncorrectClass]: statusByKey['4'] === 'incorrect',
            [btnWrongPositionClass]: statusByKey['4'] === 'wrong_position',
          })}
          onClick={() => addValue('4')}
        >
          4
        </button>
        <button
          data-testid="keyboard-key-5"
          className={cn(btnClass, btnMouseActiveClass, {
            [btnActiveClass]: keysPressed['5'],
            [btnCorrectClass]: statusByKey['5'] === 'correct',
            [btnIncorrectClass]: statusByKey['5'] === 'incorrect',
            [btnWrongPositionClass]: statusByKey['5'] === 'wrong_position',
          })}
          onClick={() => addValue('5')}
        >
          5
        </button>
        <button
          data-testid="keyboard-key-6"
          className={cn(btnClass, btnMouseActiveClass, {
            [btnActiveClass]: keysPressed['6'],
            [btnCorrectClass]: statusByKey['6'] === 'correct',
            [btnIncorrectClass]: statusByKey['6'] === 'incorrect',
            [btnWrongPositionClass]: statusByKey['6'] === 'wrong_position',
          })}
          onClick={() => addValue('6')}
        >
          6
        </button>
        <button
          data-testid="keyboard-key-7"
          className={cn(btnClass, btnMouseActiveClass, {
            [btnActiveClass]: keysPressed['7'],
            [btnCorrectClass]: statusByKey['7'] === 'correct',
            [btnIncorrectClass]: statusByKey['7'] === 'incorrect',
            [btnWrongPositionClass]: statusByKey['7'] === 'wrong_position',
          })}
          onClick={() => addValue('7')}
        >
          7
        </button>
        <button
          data-testid="keyboard-key-8"
          className={cn(btnClass, btnMouseActiveClass, {
            [btnActiveClass]: keysPressed['8'],
            [btnCorrectClass]: statusByKey['8'] === 'correct',
            [btnIncorrectClass]: statusByKey['8'] === 'incorrect',
            [btnWrongPositionClass]: statusByKey['8'] === 'wrong_position',
          })}
          onClick={() => addValue('8')}
        >
          8
        </button>
        <button
          data-testid="keyboard-key-9"
          className={cn(btnClass, btnMouseActiveClass, {
            [btnActiveClass]: keysPressed['9'],
            [btnCorrectClass]: statusByKey['9'] === 'correct',
            [btnIncorrectClass]: statusByKey['9'] === 'incorrect',
            [btnWrongPositionClass]: statusByKey['9'] === 'wrong_position',
          })}
          onClick={() => addValue('9')}
        >
          9
        </button>
      </div>
      <div className="flex items-center justify-center gap-1">
        <button
          data-testid="keyboard-key-enter"
          className={cn(btnClass, btnMouseActiveClass, 'w-fit px-4', {
            [btnActiveClass]: keysPressed['Enter'],
          })}
          onClick={onEnter}
        >
          Enter
        </button>
        <button
          data-testid="keyboard-key-+"
          className={cn(btnClass, btnMouseActiveClass, {
            [btnActiveClass]: keysPressed['+'],
            [btnCorrectClass]: statusByKey['+'] === 'correct',
            [btnIncorrectClass]: statusByKey['+'] === 'incorrect',
            [btnWrongPositionClass]: statusByKey['+'] === 'wrong_position',
          })}
          onClick={() => addValue('+')}
        >
          +
        </button>
        <button
          data-testid="keyboard-key--"
          className={cn(btnClass, btnMouseActiveClass, {
            [btnActiveClass]: keysPressed['-'],
            [btnCorrectClass]: statusByKey['-'] === 'correct',
            [btnIncorrectClass]: statusByKey['-'] === 'incorrect',
            [btnWrongPositionClass]: statusByKey['-'] === 'wrong_position',
          })}
          onClick={() => addValue('-')}
        >
          -
        </button>
        <button
          data-testid="keyboard-key-*"
          className={cn(btnClass, btnMouseActiveClass, {
            [btnActiveClass]: keysPressed['*'],
            [btnCorrectClass]: statusByKey['*'] === 'correct',
            [btnIncorrectClass]: statusByKey['*'] === 'incorrect',
            [btnWrongPositionClass]: statusByKey['*'] === 'wrong_position',
          })}
          onClick={() => addValue('*')}
        >
          *
        </button>
        <button
          data-testid="keyboard-key-/"
          className={cn(btnClass, btnMouseActiveClass, {
            [btnActiveClass]: keysPressed['/'],
            [btnCorrectClass]: statusByKey['/'] === 'correct',
            [btnIncorrectClass]: statusByKey['/'] === 'incorrect',
            [btnWrongPositionClass]: statusByKey['/'] === 'wrong_position',
          })}
          onClick={() => addValue('/')}
        >
          /
        </button>
        <button
          data-testid="keyboard-key-backspace"
          className={cn(btnClass, btnMouseActiveClass, 'w-fit px-4', {
            [btnActiveClass]: keysPressed['Backspace'],
          })}
          onClick={onDelete}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
