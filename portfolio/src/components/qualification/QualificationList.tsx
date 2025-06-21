import React from 'react';
import qualifications from './qualifications.json';
import { LangOnlyProps } from '../LanguageSwitch';

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

const QualificationList: React.FC<LangOnlyProps> = ({ lang }) => {
  const data = qualifications as QualificationItem[];
  return (
    <div>
      {createQualificationList(data)}
    </div>
  );
};

export default QualificationList;
