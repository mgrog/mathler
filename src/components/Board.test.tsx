import { Board } from '@components/Board';
import { render, renderInitialized, screen } from '@test/test-utils';

describe('Board', () => {
  it('renders the board with the correct number of pieces', () => {
    renderInitialized(<Board />); // Initializes with '2+8-3'
    const pieces = screen.getAllByTestId(/boardpiece-.*/);
    expect(pieces).toHaveLength(5 * 6);
  });
});
