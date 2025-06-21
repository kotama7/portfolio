import { render, screen } from '@testing-library/react';
import PersonalityRadar from './PersonalityRadar';

// Mock the Radar component to avoid canvas issues in jsdom
jest.mock('react-chartjs-2', () => ({
  Radar: () => <div data-testid="radar-chart" />,
}));

test('renders personality radar chart heading', () => {
  render(<PersonalityRadar />);
  expect(screen.getByText('Personality Radar Chart')).toBeInTheDocument();
});
