import React from 'react';

interface Work {
  title: string;
  type: { en: string; ja: string };
  date: string;
  url: string;
}

const works: Work[] = [
  {
    title:
      'Proposal of The AI Scientist v2 for High Performance Computing with Local Large Language Models',
    type: { en: 'Conference Poster', ja: 'ポスター発表' },
    date: '2026-01',
    url: 'https://www.sca-hpcasia2026.jp/data/poster/post213.pdf',
  },
];

export interface ResearchWorksProps {
  lang: 'en' | 'ja';
}

const ResearchWorks: React.FC<ResearchWorksProps> = ({ lang }) => (
  <div>
    <h3>{lang === 'ja' ? '研究功績' : 'Research Works'}</h3>
    <p>
      <a
        href="https://orcid.org/0009-0001-0749-5486"
        target="_blank"
        rel="noopener noreferrer"
      >
        ORCID: 0009-0001-0749-5486
      </a>
    </p>
    <ul>
      {works.map((w) => (
        <li key={w.title}>
          <a href={w.url} target="_blank" rel="noopener noreferrer">
            {w.title}
          </a>
          <br />
          {w.type[lang]} &middot; {w.date}
        </li>
      ))}
    </ul>
  </div>
);

export default ResearchWorks;
