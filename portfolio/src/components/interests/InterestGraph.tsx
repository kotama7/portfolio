import React from 'react';
import interests from './interests.json';

export interface InterestItem {
  title: string;
  children?: InterestItem[];
}

export const createInterestGraph = (data: InterestItem[]): JSX.Element => {
  return (
    <ul>
      {data.map((interest) => (
        <li key={interest.title}>
          {interest.title}
          {interest.children && createInterestGraph(interest.children)}
        </li>
      ))}
    </ul>
  );
};

const InterestGraph: React.FC = () => {
  const data = interests as InterestItem[];
  return <div>{createInterestGraph(data)}</div>;
};

export default InterestGraph;
