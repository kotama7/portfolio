import { render, screen, fireEvent } from '@testing-library/react';
import FunctionSidebar from './FunctionSidebar';

test('calls onSelect with function name', () => {
  const handler = jest.fn();
  render(<FunctionSidebar onSelect={handler} />);
  const button = screen.getByText('bioGraph');
  fireEvent.click(button);
  expect(handler).toHaveBeenCalledWith('bioGraph');
});

test('highlights selected function', () => {
  render(<FunctionSidebar onSelect={() => {}} selected="skillTree" />);
  const activeBtn = screen.getByText('skillTree');
  expect(activeBtn.className).toMatch(/active/);
});
