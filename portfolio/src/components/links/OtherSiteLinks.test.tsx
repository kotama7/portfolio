import { render, screen } from '@testing-library/react';
import OtherSiteLinks from './OtherSiteLinks';

test('renders other site links', () => {
  render(<OtherSiteLinks />);
  expect(screen.getByText('GitHub')).toBeInTheDocument();
  expect(screen.getByText('X')).toBeInTheDocument();
  expect(screen.getByText('Qiita')).toBeInTheDocument();
});
