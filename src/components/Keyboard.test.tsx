import { Board } from '@components/Board';
import { Keyboard } from '@components/Keyboard';
import { render, screen } from '@test/test-utils';
import userEvent from '@testing-library/user-event';

describe('Keyboard', () => {
  it('contains all the keys', () => {
    const { getByText } = render(<Keyboard />);
    expect(getByText('1')).toBeInTheDocument();
    expect(getByText('2')).toBeInTheDocument();
    expect(getByText('3')).toBeInTheDocument();
    expect(getByText('4')).toBeInTheDocument();
    expect(getByText('5')).toBeInTheDocument();
    expect(getByText('6')).toBeInTheDocument();
    expect(getByText('7')).toBeInTheDocument();
    expect(getByText('8')).toBeInTheDocument();
    expect(getByText('9')).toBeInTheDocument();
    expect(getByText('0')).toBeInTheDocument();
    expect(getByText('+')).toBeInTheDocument();
    expect(getByText('-')).toBeInTheDocument();
    expect(getByText('*')).toBeInTheDocument();
    expect(getByText('/')).toBeInTheDocument();
    expect(getByText('Enter')).toBeInTheDocument();
    expect(getByText('Delete')).toBeInTheDocument();
  });

  it('adds a value when a key is pressed correctly', async () => {
    render(
      <div>
        <Board />
        <Keyboard />
      </div>,
    );

    const user = userEvent.setup();
    await user.keyboard('1');
    await user.keyboard('2');
    await user.keyboard('+');
    await user.keyboard('3');

    const piece1 = screen.getByTestId(`boardpiece-row-0-col-0`);
    const piece2 = screen.getByTestId(`boardpiece-row-0-col-1`);
    const piece3 = screen.getByTestId(`boardpiece-row-0-col-2`);
    const piece4 = screen.getByTestId(`boardpiece-row-0-col-3`);

    expect(piece1.textContent).toBe('1');
    expect(piece2.textContent).toBe('2');
    expect(piece3.textContent).toBe('+');
    expect(piece4.textContent).toBe('3');
  });

  it('deletes a value when the delete key is pressed', async () => {
    render(
      <div>
        <Board />
        <Keyboard />
      </div>,
    );

    const user = userEvent.setup();
    await user.keyboard('1');
    await user.keyboard('2');
    await user.keyboard('3');
    await user.keyboard('{Backspace}');

    const piece1 = screen.getByTestId(`boardpiece-row-0-col-0`);
    const piece2 = screen.getByTestId(`boardpiece-row-0-col-1`);
    const piece3 = screen.getByTestId(`boardpiece-row-0-col-2`);

    expect(piece1.textContent).toBe('1');
    expect(piece2.textContent).toBe('2');
    expect(piece3.textContent).toBe('');
  });

  it('does not add a value when an invalid key is pressed', async () => {
    render(
      <div>
        <Board />
        <Keyboard />
      </div>,
    );

    const user = userEvent.setup();
    await user.keyboard('a');
    await user.keyboard('b');
    await user.keyboard('c');
    await user.keyboard('#');
    await user.keyboard('$');
    await user.keyboard('&');

    const piece1 = screen.getByTestId(`boardpiece-row-0-col-0`);

    expect(piece1.textContent).toBe('');
  });
});
