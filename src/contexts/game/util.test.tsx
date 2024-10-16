import { generateCommutativeReorderings } from '@contexts/game/util';
import { expect, test } from 'vitest';

test('test generating commutative solutions with commutative solution', () => {
  const solution = '1 + 2 + 3';
  const result = generateCommutativeReorderings(solution);
  expect(result).toContainEqual('1 + 2 + 3');
  expect(result).toContainEqual('1 + 3 + 2');
  expect(result).toContainEqual('2 + 1 + 3');
  expect(result).toContainEqual('2 + 3 + 1');
  expect(result).toContainEqual('3 + 1 + 2');
  expect(result).toContainEqual('3 + 2 + 1');
});
