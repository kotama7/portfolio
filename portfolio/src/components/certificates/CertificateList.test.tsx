import { render, screen } from '@testing-library/react';
import CertificateList from './CertificateList';

test('renders certificate items', () => {
  render(<CertificateList lang="en" />);
  expect(screen.getByText(/Applied Information Technology Engineer Examination/)).toBeInTheDocument();
  expect(screen.getByText(/TOEIC Listening and Reading/)).toBeInTheDocument();
});
