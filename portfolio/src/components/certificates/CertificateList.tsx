import React from 'react';
import certsEn from './certificates.json';
import certsJa from './certificates.ja.json';

export interface CertificateItem {
  title: string;
  date?: string;
}

export const createCertificateList = (data: CertificateItem[]): JSX.Element => {
  return (
    <ul>
      {data.map((item) => (
        <li key={item.title}>
          {item.title}
          {item.date && ` (${item.date})`}
        </li>
      ))}
    </ul>
  );
};

export interface CertificateListProps {
  lang: 'en' | 'ja';
}

const CertificateList: React.FC<CertificateListProps> = ({ lang }) => {
  const data = (lang === 'ja' ? certsJa : certsEn) as CertificateItem[];
  return <>{createCertificateList(data)}</>;
};

export default CertificateList;
