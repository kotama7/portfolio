import React from 'react';
import summaryEn from './thesisSummary.json';
import summaryJa from './thesisSummary.ja.json';

export interface ThesisSummaryProps {
  lang: 'en' | 'ja';
}

const ThesisSummary: React.FC<ThesisSummaryProps> = ({ lang }) => {
  const data = lang === 'ja' ? (summaryJa as { summary: string }) : (summaryEn as { summary: string });
  return <p>{data.summary}</p>;
};

export default ThesisSummary;
