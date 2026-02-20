import React from 'react';
import summaryEn from './graduationThesisSummary.json';
import summaryJa from './graduationThesisSummary.ja.json';

export interface GraduationThesisSummaryProps {
  lang: 'en' | 'ja';
}

const GraduationThesisSummary: React.FC<GraduationThesisSummaryProps> = ({ lang }) => {
  const data = lang === 'ja' ? (summaryJa as { summary: string }) : (summaryEn as { summary: string });
  return <p>{data.summary}</p>;
};

export default GraduationThesisSummary;
