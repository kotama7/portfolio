import React from 'react';
import qualifications from './qualifications.json';
import LanguageSwitch, { LangProps } from '../LanguageSwitch';

export interface QualificationItem {
  title: string;
  subtitle?: string;
  year?: string;
}

export const createQualificationList = (data: QualificationItem[]): JSX.Element => {
  return (
    <ul>
      {data.map((item) => (
        <li key={item.title}>
          {item.title}
          {item.subtitle && ` - ${item.subtitle}`}
          {item.year && ` (${item.year})`}
        </li>
      ))}
    </ul>
  );
};

const QualificationList: React.FC<LangProps> = ({ lang, setLang }) => {
  const data = qualifications as QualificationItem[];
  return (
    <div>
      <LanguageSwitch lang={lang} setLang={setLang} />
      {createQualificationList(data)}
    </div>
  );
};

export default QualificationList;
