import { render, screen } from '@testing-library/react';
import App from './App';

// Mock the chatbox component to avoid transforming ESM syntax during tests
jest.mock('react-chatbox-component', () => ({
  ChatBox: () => <div data-testid="chatbox" />,
}));

test('renders header text and chatbox', () => {
  render(<App />);
  // Default language is Japanese, so check for the Japanese header text
  const heading = screen.getByText(/樹神 宇徳/i);
  expect(heading).toBeInTheDocument();
  // Verify that chatbox placeholder renders
  expect(screen.getByTestId('chatbox')).toBeInTheDocument();
});
