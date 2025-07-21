import React from 'react';
import summaryEn from './fusepThesisSummary.json';
import summaryJa from './fusepThesisSummary.ja.json';

export interface FusepThesisSummaryProps {
  lang: 'en' | 'ja';
}

const FusepThesisSummary: React.FC<FusepThesisSummaryProps> = ({ lang }) => {
  const data = lang === 'ja' ? (summaryJa as { summary: string }) : (summaryEn as { summary: string });
  return <p>{data.summary}</p>;
};

export default FusepThesisSummary;
