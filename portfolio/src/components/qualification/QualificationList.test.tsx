import { render, screen } from '@testing-library/react';
import QualificationList from './QualificationList';

test('renders qualifications', () => {
  render(<QualificationList />);
  expect(screen.getByText(/Nagoya University/)).toBeInTheDocument();
  expect(screen.getByText(/AI App Development/)).toBeInTheDocument();
});
