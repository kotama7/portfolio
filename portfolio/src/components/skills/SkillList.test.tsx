import { render, screen } from '@testing-library/react';
import { createSkillList } from './SkillList';

const sample = [
  { category: 'Programming', skills: ['Python', 'JavaScript'] },
  { category: 'Tools', skills: ['Docker'] },
];

test('renders categories and skills', () => {
  render(<>{createSkillList(sample)}</>);
  expect(screen.getByRole('heading', { name: 'Programming' })).toBeInTheDocument();
  expect(screen.getByText('Python')).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Tools' })).toBeInTheDocument();
  expect(screen.getByText('Docker')).toBeInTheDocument();
});
