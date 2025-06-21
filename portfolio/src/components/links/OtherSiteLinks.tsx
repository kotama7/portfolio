import React from 'react';

export interface SiteLink {
  name: string;
  url: string;
}

const links: SiteLink[] = [
  { name: 'GitHub', url: 'https://github.com/kotama7' },
  { name: 'X', url: 'https://x.com/kotama7' },
  { name: 'Qiita', url: 'https://qiita.com/kotama7' }
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
