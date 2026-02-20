import React from 'react';

export interface SiteLink {
  name: string;
  url: string;
}

const links: SiteLink[] = [
  { name: 'GitHub', url: 'https://github.com/kotama7' },
  { name: 'Qiita', url: 'https://qiita.com/kotama7' },
  { name: 'Zenn', url: 'https://zenn.dev/kotama' },
  { name: 'X', url: 'https://x.com/kotama8' },
  { name: 'LinkedIn', url: 'https://www.linkedin.com/in/takanori-kotama-b785b52a4/' },
  { name: 'ORCID', url: 'https://orcid.org/0009-0001-0749-5486' }
];

const OtherSiteLinks: React.FC = () => (
  <div>
    <h3>Other Sites</h3>
    <ul>
      {links.map(link => (
        <li key={link.name}>
          <a href={link.url} target="_blank" rel="noopener noreferrer">
            {link.name}
          </a>
        </li>
      ))}
    </ul>
  </div>
);

export default OtherSiteLinks;
