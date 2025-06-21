import { render, screen } from '@testing-library/react';
import PersonalityRadar from './PersonalityRadar';


beforeAll(() => {
  Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
    value: jest.fn(),
  });
});

test('renders personality radar chart heading', () => {
  render(<PersonalityRadar lang="en" setLang={() => {}} />);
  expect(screen.getByText('Personality Radar Chart')).toBeInTheDocument();
});
