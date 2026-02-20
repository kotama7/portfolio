import React from 'react';
import contributionsEn from './contributions.json';
import contributionsJa from './contributions.ja.json';

export interface ContributionItem {
  name: string;
  role: string;
  description: string;
  url: string;
}

export interface ContributionsProps {
  lang: 'en' | 'ja';
}

const Contributions: React.FC<ContributionsProps> = ({ lang }) => {
  const data = (lang === 'ja' ? contributionsJa : contributionsEn) as ContributionItem[];
  return (
    <ul>
      {data.map((item) => (
        <li key={item.name} style={{ marginBottom: '8px' }}>
          <a href={item.url} target="_blank" rel="noopener noreferrer">
            <strong>{item.name}</strong>
          </a>{' '}
          — {item.role}
          <br />
          {item.description}
        </li>
      ))}
    </ul>
  );
};

export default Contributions;
