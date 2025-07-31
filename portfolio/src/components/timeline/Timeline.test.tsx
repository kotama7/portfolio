import { render, screen } from '@testing-library/react';
import { Timestamp } from 'firebase/firestore';
import Timeline, { TimelineEvent } from './Timeline';

test('renders events in chronological order', () => {
  const events: TimelineEvent[] = [
    {
      title: 'Second',
      description: 'second event',
      date: Timestamp.fromDate(new Date('2021-01-02')),
    },
    {
      title: 'First',
      description: 'first event',
      date: Timestamp.fromDate(new Date('2021-01-01')),
    },
  ];

  render(<Timeline events={events} />);

  const items = screen.getAllByRole('listitem');
  expect(items[0]).toHaveTextContent('First');
  expect(items[1]).toHaveTextContent('Second');
});
