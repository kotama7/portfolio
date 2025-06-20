import { render, screen } from '@testing-library/react';
import PersonalityRadar from './PersonalityRadar';

test('renders personality radar chart heading', () => {
  render(<PersonalityRadar />);
  expect(screen.getByText('Personality Radar Chart')).toBeInTheDocument();
});
