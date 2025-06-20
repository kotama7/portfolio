import { render, screen } from '@testing-library/react';
import App from './App';

// Mock the chatbox component to avoid transforming ESM syntax during tests
jest.mock('react-chatbox-component', () => ({
  ChatBox: () => <div data-testid="chatbox" />,
}));

// Mock Radar chart to avoid canvas issues when rendering App
jest.mock('react-chartjs-2', () => ({
  Radar: () => <div data-testid="radar-chart" />,
}));

test('renders header text and skill tree', () => {
  render(<App />);
  // Default language is Japanese, so check for the Japanese header text
  const heading = screen.getByText(/樹神 宇徳/i);
  expect(heading).toBeInTheDocument();
  expect(screen.getAllByText(/Frontend/i).length).toBeGreaterThan(0);
});
