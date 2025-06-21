import React from 'react';
import { Chrono } from 'react-chrono';
import LanguageSwitch, { LangProps } from '../LanguageSwitch';
import items from './bio.json';

export interface BioItem {
  title: string;
  cardTitle: string;
  cardSubtitle?: string;
  cardDetailedText?: string;
}

const BioTree: React.FC<LangProps> = ({ lang, setLang }) => {
  const data = items as BioItem[];
  return (
    <div>
      <LanguageSwitch lang={lang} setLang={setLang} />
      <Chrono items={data} mode="VERTICAL_ALTERNATING" />
    </div>
  );
};

export default BioTree;
