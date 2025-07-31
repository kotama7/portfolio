import React from 'react';
import { Timestamp } from 'firebase/firestore';
import './timeline.css';

export interface TimelineEvent {
  title: string;
  description: string;
  date: Timestamp;
}

export interface TimelineProps {
  events: TimelineEvent[];
}

const Timeline: React.FC<TimelineProps> = ({ events }) => {
  const sorted = [...events].sort(
    (a, b) => a.date.toMillis() - b.date.toMillis()
  );

  return (
    <ul className="timeline">
      {sorted.map((event) => (
        <li key={`${event.title}-${event.date.seconds}`} className="timeline-item">
          <div className="timeline-date">
            {event.date.toDate().toLocaleDateString()}
          </div>
          <div className="timeline-content">
            <strong>{event.title}</strong>
            <p>{event.description}</p>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default Timeline;
