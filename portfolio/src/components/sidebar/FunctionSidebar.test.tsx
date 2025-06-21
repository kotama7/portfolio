import { render, screen } from '@testing-library/react';
import FunctionSidebar from './FunctionSidebar';

it('renders defined functions', () => {
  render(
    <FunctionSidebar open={true} onClose={() => {}} onSelect={() => {}} />
  );
  expect(screen.getByText('Biography Graph')).toBeInTheDocument();
  expect(screen.getByText('Portfolio Summary')).toBeInTheDocument();
});
