const operators: Record<string, { precedence: number }> = {
  '+': { precedence: 1 },
  '-': { precedence: 1 },
  '*': { precedence: 2 },
  '/': { precedence: 2 },
};

function tokenize(expr: string): string[] {
  return expr.match(/(\d+|\+|\-|\*|\/|\(|\))/g) || [];
}

/// Convert to Reverse Polish Notation
export function toRPN(tokens: string[]): string[] {
  const outputQueue: string[] = [];
  const operatorStack: string[] = [];

  tokens.forEach((token) => {
    if (/\d/.test(token)) {
      outputQueue.push(token);
    } else if (token in operators) {
      while (
        operatorStack.length &&
        operators[operatorStack[operatorStack.length - 1]] &&
        operators[token].precedence <=
          operators[operatorStack[operatorStack.length - 1]].precedence
      ) {
        outputQueue.push(operatorStack.pop()!);
      }
      operatorStack.push(token);
    } else if (token === '(') {
      operatorStack.push(token);
    } else if (token === ')') {
      while (
        operatorStack.length &&
        operatorStack[operatorStack.length - 1] !== '('
      ) {
        outputQueue.push(operatorStack.pop()!);
      }
      operatorStack.pop();
    }
  });

  while (operatorStack.length) {
    outputQueue.push(operatorStack.pop()!);
  }

  return outputQueue;
}

export function evaluateExpression(expression: string): number {
  function evaluateRPN(rpn: string[]): number {
    const stack: number[] = [];

    rpn.forEach((token) => {
      if (/\d/.test(token)) {
        stack.push(parseFloat(token));
      } else if (token in operators) {
        const b = stack.pop()!;
        const a = stack.pop()!;
        switch (token) {
          case '+':
            stack.push(a + b);
            break;
          case '-':
            stack.push(a - b);
            break;
          case '*':
            stack.push(a * b);
            break;
          case '/':
            stack.push(a / b);
            break;
          default:
            // No op
            break;
        }
      }
    });

    return stack[0];
  }

  const tokens = tokenize(expression);
  const rpn = toRPN(tokens);
  return evaluateRPN(rpn);
}

/// This has roughly O(n*2^(n)) time and space complexity
/// where n is the number of commutative operators.
/// Fortunately, n is small
export function generateCommutativeReorderings(expression: string) {
  const answer = evaluateExpression(expression);
  const tokens = tokenize(expression);
  const trees = generateTrees(tokens);
  // console.log('All trees:', trees.map(printTree));
  return trees.map(printTree).reduce<Set<string>>((acc, tree) => {
    if (evaluateExpression(tree) === answer) {
      acc.add(tree);
    }
    return acc;
  }, new Set());
}

type TreeNode = {
  value: string;
  left?: TreeNode;
  right?: TreeNode;
};

function generateTrees(tokens: string[]): TreeNode[] {
  if (tokens.length === 1) {
    return [{ value: tokens[0] }];
  }

  const trees: TreeNode[] = [];

  for (let i = 1; i < tokens.length; i += 1) {
    // Only make a tree if the token is an operator
    if (!operators.hasOwnProperty(tokens[i])) {
      continue;
    }
    const leftTokens = tokens.slice(0, i);
    const rightTokens = tokens.slice(i + 1);

    const leftTrees = generateTrees(leftTokens);
    const rightTrees = generateTrees(rightTokens);

    for (const leftTree of leftTrees) {
      for (const rightTree of rightTrees) {
        trees.push({
          value: tokens[i],
          left: leftTree,
          right: rightTree,
        });
        // If the operators are commutative, swapping left and right trees are equivalent in the following cases
        if (
          // If both roots are commutative or leaves
          ((!leftTree.left && !leftTree.right) ||
            leftTree.value === '*' ||
            leftTree.value === '+') &&
          ((!rightTree.left && !rightTree.right) ||
            rightTree.value === '*' ||
            rightTree.value === '+') &&
          (tokens[i] === '+' || tokens[i] === '*')
        ) {
          trees.push({
            value: tokens[i],
            left: rightTree,
            right: leftTree,
          });
        }
      }
    }
  }

  return trees;
}

function printTree(node: TreeNode): string {
  if (!node.left && !node.right) {
    return node.value;
  }
  const left = node.left ? printTree(node.left) : '';
  const right = node.right ? printTree(node.right) : '';
  return `${left} ${node.value} ${right}`;
}
