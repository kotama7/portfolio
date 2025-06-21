import { render, screen } from '@testing-library/react';
import FunctionSidebar from './FunctionSidebar';

it('renders defined functions', () => {
  render(
    <FunctionSidebar open={true} onClose={() => {}} onSelect={() => {}} />
  );
  expect(screen.getByText('bioGraph')).toBeInTheDocument();
  expect(screen.getByText('portfolioSummary')).toBeInTheDocument();
});
