import { render, screen } from '@testing-library/react';
import InterestGraph from './InterestGraph';

test('renders interest graph items', () => {
  render(<InterestGraph lang="en" />);
  expect(screen.getByText('Technology')).toBeInTheDocument();
  expect(screen.getByText('Artificial Intelligence')).toBeInTheDocument();
});
