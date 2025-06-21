import { render, screen } from '@testing-library/react';
import App from './App';

// Mock the chatbox component so it doesn't fail during tests
jest.mock('react-chatbox-component', () => ({
  ChatBox: () => <div data-testid="chatbox" />,
}));

// Mock Radar chart to avoid canvas issues when rendering App
jest.mock('react-chartjs-2', () => ({
  Radar: () => <div data-testid="radar-chart" />,
}));

test('renders main sections including other site links', () => {
  render(<App />);
  expect(screen.getByText(/樹神 宇徳/i)).toBeInTheDocument();
  expect(screen.getByText(/Frontend/i)).toBeInTheDocument();
  expect(screen.getByText('Other Sites')).toBeInTheDocument();
});
