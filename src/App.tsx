import { Board } from '@components/Board';
import { Keyboard } from '@components/Keyboard';
import { Message } from '@components/Message';
import { useGameContext } from '@contexts/game/context';
import { evaluateExpression } from '@contexts/game/util';
import { useEffect, useState } from 'react';

const App: React.FC = () => {
  const { solution, error, winStatus, dispatch } = useGameContext();
  const [showError, setShowError] = useState(false);

  const answer = evaluateExpression(solution);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (error) {
      setShowError(true);
      // Close the message after 5 seconds
      timeout = setTimeout(() => setShowError(false), 5000);
    }

    return () => clearTimeout(timeout);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col place-items-center pt-[25%] gap-4 bg-main-gradient p-2 text-center font-inter text-base font-normal leading-6 text-gray-50">
      <Message open={showError} onOpenChange={setShowError}>
        {error?.status === 'wrong_sum' ? (
          <p>
            Every guess must equal {answer}, or are you forgetting order of
            operations?
          </p>
        ) : error?.status === 'wrong_size' ? (
          <p>Not enough numbers.</p>
        ) : error?.status === 'leading_zeroes' ? (
          <p>A guess cannot contain leading zeroes!</p>
        ) : error?.status === 'divide_by_zero' ? (
          <p>Can&apos;t divide by zero!</p>
        ) : null}
      </Message>
      <h1 className="text-3xl font-black text-black">Mathler</h1>
      <h3 className="text-xl text-black">
        Find the solution that adds up to {answer}
      </h3>
      <Board />
      <Keyboard />
      <div className="flex flex-col gap-1 my-4">
        {winStatus === 'exact_win' || winStatus === 'commutative_win' ? (
          <>
            <p className="text-black font-bold text-2xl">Hey good game!</p>
            {winStatus === 'commutative_win' && (
              <p className="text-black font-bold text-xl">
                Commutative answer for {solution} accepted!
              </p>
            )}
          </>
        ) : winStatus === 'lose' ? (
          <p className="text-black font-bold text-2xl">
            Sorry, you&apos;ve used up all your guesses!
            <br />
            The solution was {solution}.
          </p>
        ) : null}
      </div>

      {winStatus !== 'playing' ? (
        <button
          className="bg-blue-950 text-white font-bold px-6 py-4 rounded"
          onClick={() => dispatch({ type: 'RESET_GAME' })}
        >
          Play Again?
        </button>
      ) : null}
    </div>
  );
};

export default App;
