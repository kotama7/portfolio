import React from 'react';
import qualificationsEn from './qualifications.json';
import qualificationsJa from './qualifications.ja.json';

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

export interface QualificationListProps {
  lang: 'en' | 'ja';
}

const QualificationList: React.FC<QualificationListProps> = ({ lang }) => {
  const data = (lang === 'ja' ? qualificationsJa : qualificationsEn) as QualificationItem[];
  return <>{createQualificationList(data)}</>;
};

export default QualificationList;
