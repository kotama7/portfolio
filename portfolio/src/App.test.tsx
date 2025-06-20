import { render, screen } from '@testing-library/react';
import Header from './components/header/header';
import SkillTree from './components/skills/SkillTree';

// Mock the chatbox component so it doesn't fail during tests
jest.mock('react-chatbox-component', () => ({
  ChatBox: () => <div data-testid="chatbox" />,
}));

test('renders header text and skill tree', () => {
  render(<Header lang="ja" setLang={() => {}} />);
  expect(screen.getByText(/樹神 宇徳/i)).toBeInTheDocument();
  render(<SkillTree />);
  expect(screen.getByText(/Frontend/i)).toBeInTheDocument();
});
