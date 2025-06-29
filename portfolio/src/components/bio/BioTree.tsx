import React from 'react';
import { Chrono } from 'react-chrono';
import itemsEn from './bio.json';
import itemsJa from './bio.ja.json';

export interface BioItem {
  title: string;
  cardTitle: string;
  cardSubtitle?: string;
  cardDetailedText?: string;
}

export interface BioTreeProps {
  lang: 'en' | 'ja';
}

const BioTree: React.FC<BioTreeProps> = ({ lang }) => {
  const data = (lang === 'ja' ? itemsJa : itemsEn) as BioItem[];
  return <Chrono items={data} mode="VERTICAL_ALTERNATING" />;
};

export default BioTree;
