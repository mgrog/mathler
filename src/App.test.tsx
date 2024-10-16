import App from '@App';

import { render, renderInitialized, screen, userEvent } from '@test/test-utils';

describe('App', () => {
  it('the title is visible', () => {
    render(<App />);
    expect(screen.getByText(/Mathler/i)).toBeInTheDocument();
  });

  it('will mark pieces on the board when a guess is made', async () => {
    renderInitialized(<App />); // Initializes with '2+8-3'

    const user = userEvent.setup();
    await user.keyboard('2');
    await user.keyboard('*');
    await user.keyboard('3');
    await user.keyboard('+');
    await user.keyboard('1');
    await user.keyboard('{Enter}');

    const piece1 = screen.getByTestId(`boardpiece-row-0-col-0`);
    const piece2 = screen.getByTestId(`boardpiece-row-0-col-1`);
    const piece3 = screen.getByTestId(`boardpiece-row-0-col-2`);
    const piece4 = screen.getByTestId(`boardpiece-row-0-col-3`);
    const piece5 = screen.getByTestId(`boardpiece-row-0-col-4`);

    expect(piece1.textContent).toBe('2');
    expect(piece2.textContent).toBe('*');
    expect(piece3.textContent).toBe('3');
    expect(piece4.textContent).toBe('+');
    expect(piece5.textContent).toBe('1');

    expect(piece1).toHaveAttribute(
      'aria-label',
      'guess 1 column 1 has correct status',
    );
    expect(piece2).toHaveAttribute(
      'aria-label',
      'guess 1 column 2 has incorrect status',
    );
    expect(piece3).toHaveAttribute(
      'aria-label',
      'guess 1 column 3 has wrong_position status',
    );
    expect(piece4).toHaveAttribute(
      'aria-label',
      'guess 1 column 4 has wrong_position status',
    );
    expect(piece5).toHaveAttribute(
      'aria-label',
      'guess 1 column 5 has incorrect status',
    );
  });

  it('will win the game when the correct guess is made', async () => {
    renderInitialized(<App />); // Initializes with '2+8-3'

    const user = userEvent.setup();
    await user.keyboard('2');
    await user.keyboard('+');
    await user.keyboard('8');
    await user.keyboard('-');
    await user.keyboard('3');
    await user.keyboard('{Enter}');

    const piece1 = screen.getByTestId(`boardpiece-row-0-col-0`);
    const piece2 = screen.getByTestId(`boardpiece-row-0-col-1`);
    const piece3 = screen.getByTestId(`boardpiece-row-0-col-2`);
    const piece4 = screen.getByTestId(`boardpiece-row-0-col-3`);
    const piece5 = screen.getByTestId(`boardpiece-row-0-col-4`);

    const pieces = [piece1, piece2, piece3, piece4, piece5];

    for (let i = 0; i < pieces.length; i += 1) {
      expect(pieces[i]).toHaveAttribute(
        'aria-label',
        `guess 1 column ${i + 1} has correct status`,
      );
    }

    expect(screen.getByText(/Hey good game!/i)).toBeInTheDocument();
  });

  it('will lose the game when too many incorrect guesses are made', async () => {
    renderInitialized(<App />); // Initializes with '2+8-3'

    const user = userEvent.setup();
    for (let i = 0; i < 6; i += 1) {
      await user.keyboard('2');
      await user.keyboard('*');
      await user.keyboard('3');
      await user.keyboard('+');
      await user.keyboard('1');
      await user.keyboard('{Enter}');
    }

    const board = screen.getByTestId('boardpiece-row-5-col-4');

    expect(
      screen.getByText(/Sorry, you've used up all your guesses!/i),
    ).toBeInTheDocument();
  });

  it('will reset the game when the reset button is clicked', async () => {
    renderInitialized(<App />); // Initializes with '2+8-3'

    const user = userEvent.setup();
    await user.keyboard('2');
    await user.keyboard('+');
    await user.keyboard('8');
    await user.keyboard('-');
    await user.keyboard('3');
    await user.keyboard('{Enter}');

    const resetButton = screen.getByText(/Play Again?/i);
    await userEvent.click(resetButton);

    const piece1 = screen.getByTestId(`boardpiece-row-0-col-0`);
    const piece2 = screen.getByTestId(`boardpiece-row-0-col-1`);

    expect(piece1.textContent).toBe('');
    expect(piece2.textContent).toBe('');
  });
});
