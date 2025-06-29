import { render, screen } from '@testing-library/react';
import SkillTree from './SkillTree';

test('renders skill tree items', () => {
  render(<SkillTree lang="en" />);
  expect(screen.getByText('Programming')).toBeInTheDocument();
  expect(screen.getByText('Python')).toBeInTheDocument();
  expect(screen.getByText('AI & ML')).toBeInTheDocument();
});
