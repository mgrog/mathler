import { useGameContext } from '@contexts/game/context';
import { expressionToArray } from '@utils/helpers';
import { useCallback } from 'react';

export function useGetKeyStatus() {
  const { solution, enteredAnswers, commutativeReorderings } = useGameContext();
  const targetArr = expressionToArray(solution);
  const getKeyStatus = useCallback(
    (rowIdx: number, colIdx: number, value: string) => {
      if (value === '') return 'empty';
      if (enteredAnswers.length < rowIdx + 1) return 'empty';
      if (value === targetArr[colIdx]) return 'correct';
      // Check commutative reorderings
      if (solution.includes('+') || solution.includes('*')) {
        for (const reorder of commutativeReorderings) {
          if (reorder[colIdx] === value) return 'correct';
        }
      }
      if (targetArr.includes(value)) return 'wrong_position';
      return 'incorrect';
    },
    [solution, enteredAnswers, commutativeReorderings],
  );

  return getKeyStatus;
}
