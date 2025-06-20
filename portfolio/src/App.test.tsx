import { render, screen } from '@testing-library/react';
import SkillTree from './components/skills/SkillTree';

test('renders skill tree from JSON', () => {
  render(<SkillTree />);
  expect(screen.getByText('Frontend')).toBeInTheDocument();
});
