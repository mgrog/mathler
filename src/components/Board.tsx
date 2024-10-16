import { cn } from '@utils';

import { useGameContext } from '@contexts/game/context';
import { useGetKeyStatus } from '@hooks/useGetKeyStatus';

type Status = 'empty' | 'correct' | 'incorrect' | 'wrong_position';

export function Board() {
  const { boardState } = useGameContext();
  const numRows = boardState.length;
  const numCols = boardState[0].length;
  const getKeyStatus = useGetKeyStatus();

  return (
    <div
      data-testid="board"
      className="grid gap-1.5"
      style={{
        gridTemplateRows: `repeat(${numRows}, minmax(0, 1fr))`,
        gridTemplateColumns: `repeat(${numCols}, minmax(0, 1fr))`,
      }}
    >
      {boardState.map((row, rowIdx) =>
        row.map((value, colIdx) => {
          const keyStatus = getKeyStatus(rowIdx, colIdx, value);
          return (
            <BoardPiece
              key={`boardpiece-row-${rowIdx}-col-${colIdx}`}
              data-testid={`boardpiece-row-${rowIdx}-col-${colIdx}`}
              value={value}
              status={keyStatus}
              aria-label={`guess ${rowIdx + 1} column ${colIdx + 1} has ${keyStatus} status`}
            />
          );
        }),
      )}
    </div>
  );
}

interface BoardPieceProps {
  value?: string;
  status: Status;
}

function BoardPiece({ value, status, ...props }: BoardPieceProps) {
  return (
    <div
      {...props}
      className={cn(
        'flex h-10 w-14 items-center justify-center border-2 text-xl font-bold rounded',
        {
          'bg-white border-slate-300 text-black': status === 'empty',
          'bg-[#727F93] border-[#727F93]': status === 'incorrect',
          'bg-[#E2B53F] border-[#E2B53F]': status === 'wrong_position',
          'bg-green-500 border-green-500': status === 'correct',
        },
      )}
    >
      {value}
    </div>
  );
}
