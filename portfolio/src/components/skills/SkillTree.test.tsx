import { render, screen } from '@testing-library/react';
import SkillTree from './SkillTree';

test('renders skill tree items', () => {
  render(<SkillTree lang="en" setLang={() => {}} />);
  expect(screen.getByText('Frontend')).toBeInTheDocument();
  expect(screen.getByText('React')).toBeInTheDocument();
  expect(screen.getByText('Backend')).toBeInTheDocument();
});
