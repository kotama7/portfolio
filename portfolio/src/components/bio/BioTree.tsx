import React from 'react';
import { Chrono } from 'react-chrono';
import { LangOnlyProps } from '../LanguageSwitch';
import items from './bio.json';

export interface BioItem {
  title: string;
  cardTitle: string;
  cardSubtitle?: string;
  cardDetailedText?: string;
}

const BioTree: React.FC<LangOnlyProps> = ({ lang }) => {
  const data = items as BioItem[];
  return (
    <div>
      <Chrono items={data} mode="VERTICAL_ALTERNATING" />
    </div>
  );
};

export default BioTree;
