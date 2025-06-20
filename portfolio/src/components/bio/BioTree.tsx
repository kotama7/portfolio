import React from 'react';
import { Chrono } from 'react-chrono';
import items from './bio.json';

export interface BioItem {
  title: string;
  cardTitle: string;
  cardSubtitle?: string;
  cardDetailedText?: string;
}

const BioTree: React.FC = () => {
  const data = items as BioItem[];
  return <Chrono items={data} mode="VERTICAL_ALTERNATING" />;
};

export default BioTree;
