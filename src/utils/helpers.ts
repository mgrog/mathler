export function expressionToArray(expr: string) {
  return expr.split('').filter((s) => s !== ' ');
}

const operators = new Set(['+', '-', '*', '/']);

export function entryArrayToExpression(entry: string[]): string {
  return entry
    .map((s) => {
      return operators.has(s) ? ` ${s} ` : s;
    })
    .join('');
}
