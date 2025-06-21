import React from 'react';
import qualifications from './qualifications.json';

export interface QualificationItem {
  title: string;
  subtitle?: string;
  year?: string;
}

export const renderQualificationList = (data: QualificationItem[]): JSX.Element => {
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

const QualificationList: React.FC = () => {
  const data = qualifications as QualificationItem[];
  return <div>{renderQualificationList(data)}</div>;
};

export default QualificationList;
