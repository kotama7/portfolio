import { render, screen } from '@testing-library/react';
import App from './App';
import SkillTree from './components/skilltree/SkillTree';

// Mock the chatbox component to avoid transforming ESM syntax during tests
jest.mock('react-chatbox-component', () => ({
  ChatBox: () => <div data-testid="chatbox" />,
}));

test('renders header text and skill tree', () => {
  render(<App />);
  // Default language is Japanese, so check for the Japanese header text
  const heading = screen.getByText(/樹神 宇徳/i);
  expect(heading).toBeInTheDocument();
  render(<SkillTree />);
  expect(screen.getByText(/Frontend/i)).toBeInTheDocument();
});
