import { render, screen } from '@testing-library/react';
import App from './App';

// Mock the chatbox component to avoid transforming ESM syntax during tests
jest.mock('react-chatbox-component', () => ({
  ChatBox: () => <div data-testid="chatbox" />,
}));

test('renders header text and chatbox', () => {
  render(<App />);
  // The header should display the English name by default
  const heading = screen.getByText(/Takanori Kotama/i);
  expect(heading).toBeInTheDocument();
  // Verify that chatbox placeholder renders
  expect(screen.getByTestId('chatbox')).toBeInTheDocument();
});
