import React from 'react';
import interestsEn from './interests.json';
import interestsJa from './interests.ja.json';

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

export interface InterestGraphProps {
  lang: 'en' | 'ja';
}

const InterestGraph: React.FC<InterestGraphProps> = ({ lang }) => {
  const data = (lang === 'ja' ? interestsJa : interestsEn) as InterestItem[];
  return <>{createInterestGraph(data)}</>;
};

export default InterestGraph;
