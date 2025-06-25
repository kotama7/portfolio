import { render, screen, fireEvent } from '@testing-library/react';
import FunctionSidebar from './FunctionSidebar';

test('calls onSelect with function name', () => {
  const handler = jest.fn();
  render(<FunctionSidebar onSelect={handler} />);
  const button = screen.getByText('Please explain your biography');
  fireEvent.click(button);
  expect(handler).toHaveBeenCalledWith('bioGraph');
});


test('highlights selected function', () => {
  render(<FunctionSidebar onSelect={() => {}} selected="skillTree" />);
  const activeBtn = screen.getByText('Show me your skills');
  expect(activeBtn.className).toMatch(/active/);
});
