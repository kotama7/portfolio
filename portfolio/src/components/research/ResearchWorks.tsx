import React from 'react';

interface Work {
  title: { en: string; ja: string };
  type: { en: string; ja: string };
  venue: { en: string; ja: string };
  authors?: { en: string; ja: string };
  date: string;
  url?: string;
}

const works: Work[] = [
  {
    title: {
      en: 'HPC-AutoResearch: An HPC-Native Framework for Autonomous LLM-Driven Experimentation',
      ja: 'HPC-AutoResearch: An HPC-Native Framework for Autonomous LLM-Driven Experimentation',
    },
    type: { en: 'Conference Talk', ja: '国際会議口頭発表' },
    venue: {
      en: 'ATAT 2026 (Conference on Advanced Topics and Auto Tuning in High-Performance Scientific Computing), National Taiwan University, Mar 20–21 2026 (presented)',
      ja: 'ATAT 2026（高性能科学計算における先進的トピックと自動チューニング国際会議）、国立台湾大学、2026年3月20–21日（発表済）',
    },
    authors: {
      en: 'Takanori Kotama (Nagoya U. / RIKEN), Shun-ichiro Hayashi (Nagoya U.), Daichi Mukunoki (Nagoya U.), Rio Yokota (RIKEN), Satoshi Ohshima (Kyushu U.), Tetsuya Hoshino (Nagoya U.), Takahiro Katagiri (Nagoya U.)',
      ja: '樹神 宇徳（名古屋大／理研）, 林 俊一郎（名古屋大）, 椋木 大地（名古屋大）, 横田 理央（理研）, 大島 聡史（九大）, 星野 哲也（名古屋大）, 片桐 孝洋（名古屋大）',
    },
    date: '2026-03',
    url: 'https://ncts.ntu.edu.tw/events_2_detail.php?nid=546',
  },
  {
    title: {
      en: 'Crystal Fractional Graph Neural Network for Energy Prediction of High-Entropy Alloys',
      ja: 'Crystal Fractional Graph Neural Network for Energy Prediction of High-Entropy Alloys',
    },
    type: { en: 'Preprint (arXiv)', ja: 'プレプリント（arXiv）' },
    venue: {
      en: 'arXiv:2605.08103 · DOI 10.48550/arXiv.2605.08103 · physics.comp-ph (primary), cond-mat.mtrl-sci, cs.AI',
      ja: 'arXiv:2605.08103 · DOI 10.48550/arXiv.2605.08103 · physics.comp-ph（主）, cond-mat.mtrl-sci, cs.AI',
    },
    authors: {
      en: 'Takanori Kotama (Nagoya U., 1st author), Yang Huang (USTC)',
      ja: '樹神 宇徳（名古屋大、筆頭著者）, Yang Huang（USTC）',
    },
    date: '2026-04',
    url: 'https://arxiv.org/abs/2605.08103',
  },
  {
    title: {
      en: 'HPC-AutoResearch: An Autonomous Research System for HPC Based on AI Scientist v2 with Phase-Separated Execution and Hierarchical Memory',
      ja: 'HPC-AutoResearch：AI Scientist v2に基づくフェーズ分離実行と階層記憶によるHPC向け自律研究システム',
    },
    type: { en: 'Conference Talk', ja: '口頭発表' },
    venue: {
      en: '203rd IPSJ HPC SIG / 17th Quantum Software SIG Joint Workshop, Hokkaido University (hybrid), Mar 16–18 2026',
      ja: '第203回情報処理学会HPC研究会・第17回量子ソフトウェア研究会 合同研究発表会、北海道大学（ハイブリッド）、2026年3月16–18日',
    },
    authors: {
      en: 'Takanori Kotama (Nagoya U. / RIKEN), Shun-ichiro Hayashi (Nagoya U.), Daichi Mukunoki (Nagoya U.), Rio Yokota (RIKEN), Satoshi Ohshima (Kyushu U.), Tetsuya Hoshino (Nagoya U.), Takahiro Katagiri (Nagoya U.)',
      ja: '樹神 宇徳（名古屋大／理研）, 林 俊一郎（名古屋大）, 椋木 大地（名古屋大）, 横田 理央（理研）, 大島 聡史（九大）, 星野 哲也（名古屋大）, 片桐 孝洋（名古屋大）',
    },
    date: '2026-03',
  },
  {
    title: {
      en: 'Proposal of The AI Scientist v2 for High Performance Computing with Local Large Language Models',
      ja: 'Proposal of The AI Scientist v2 for High Performance Computing with Local Large Language Models',
    },
    type: { en: 'Conference Poster', ja: 'ポスター発表' },
    venue: {
      en: 'HPC Asia 2026',
      ja: 'HPC Asia 2026',
    },
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
        href="https://researchmap.jp/kotama_takanori"
        target="_blank"
        rel="noopener noreferrer"
      >
        researchmap: kotama_takanori
      </a>
      {' · '}
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
        <li key={w.title.en}>
          {w.url ? (
            <a href={w.url} target="_blank" rel="noopener noreferrer">
              {w.title[lang]}
            </a>
          ) : (
            <strong>{w.title[lang]}</strong>
          )}
          <br />
          {w.type[lang]} &middot; {w.venue[lang]} &middot; {w.date}
          {w.authors && (
            <>
              <br />
              {w.authors[lang]}
            </>
          )}
        </li>
      ))}
    </ul>
  </div>
);

export default ResearchWorks;
