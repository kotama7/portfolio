import { render, screen } from '@testing-library/react';
import QualificationList from './QualificationList';

test('renders qualifications', () => {
  render(<QualificationList lang="en" />);
  expect(screen.getByText(/Nagoya University/)).toBeInTheDocument();
  expect(screen.getByText(/AI App Development/)).toBeInTheDocument();
});
