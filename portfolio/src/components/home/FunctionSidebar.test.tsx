import { render, screen, fireEvent } from '@testing-library/react';
import FunctionSidebar from './FunctionSidebar';

test('calls onSelect with function name', () => {
  const handler = jest.fn();
  render(<FunctionSidebar onSelect={handler} lang="en" />);
  const button = screen.getByText('Please explain your biography');
  fireEvent.click(button);
  expect(handler).toHaveBeenCalledWith('bioGraph');
});

test('includes newChat button', () => {
  const handler = jest.fn();
  render(<FunctionSidebar onSelect={handler} lang="ja" />);
  const newChatBtn = screen.getByText('新しいチャット');
  fireEvent.click(newChatBtn);
  expect(handler).toHaveBeenCalledWith('newChat');
});

test('highlights selected function', () => {
  render(<FunctionSidebar onSelect={() => {}} selected="skillTree" lang="en" />);
  const activeBtn = screen.getByText('Show me your skills');
  expect(activeBtn.className).toMatch(/active/);
});

test('contains profileInfo option', () => {
  render(<FunctionSidebar onSelect={() => {}} lang="en" />);
  expect(screen.getByText('Profile summary and awards')).toBeInTheDocument();
});
