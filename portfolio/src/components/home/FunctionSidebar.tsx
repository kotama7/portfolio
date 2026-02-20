import React from 'react';

export interface FunctionSidebarProps {
  onSelect: (name: string) => void;
  selected?: string | null;
  onClose?: () => void;
  lang: 'en' | 'ja';
}

interface FunctionItem {
  id: string;
}

// The sidebar originally contained a large list of functions which could be
// overwhelming. Trim the menu to only expose the most commonly used options.
const functions: FunctionItem[] = [
  { id: 'bioGraph' },
  { id: 'skillTree' },
  { id: 'interestGraph' },

  { id: 'contactInfo' },
  { id: 'portfolioSummary' },
];

export const labels: Record<string, { en: string; ja: string }> = {
  bioGraph: { en: 'Please explain your biography', ja: '経歴を教えてください' },
  skillTree: { en: 'Show me your skills', ja: 'スキルを見せてください' },
  interestGraph: { en: 'What are your interests?', ja: '興味を教えてください' },

  contactInfo: { en: 'Provide your contact info', ja: '連絡先を教えてください' },
  portfolioSummary: { en: 'Summarize your portfolio', ja: 'ポートフォリオを要約してください' },
  otherSiteLinks: { en: 'Share other site links', ja: 'その他のリンクを教えてください' },
  profileInfo: { en: 'Profile summary and awards', ja: '概要と受賞など' },
  briefIntro: { en: 'Give me a brief intro', ja: '自己紹介をお願いします' },
  thesisSummary: { en: 'Show thesis summary', ja: '論文要約を見せて' },
  fusepThesisSummary: { en: 'Show FuSEP thesis', ja: '夏研論文を教えて' },
  graduationThesis: { en: 'Show graduation thesis', ja: '卒業論文を教えて' },
  favoriteLanguage: { en: 'Favorite programming language?', ja: '好きなプログラミング言語は？' },
  majorProjects: { en: 'Show major projects', ja: '主要プロジェクトを見せて' },
  contributions: { en: 'Show contributions', ja: 'コントリビューションを教えて' },
  researchWorks: { en: 'Show research works', ja: '研究功績を教えて' },
  newChat: { en: 'newChat', ja: '新しいチャット' },
};

const FunctionSidebar: React.FC<FunctionSidebarProps> = ({ onSelect, selected, onClose, lang }) => (
  <div className="sidebar">
    {onClose && (
      <button className="sidebar-close" onClick={onClose} aria-label="close sidebar">
        ×
      </button>
    )}
    <h3>Sample Chat</h3>
    <ul>
      <li key="newChat">
        <button className="sidebar-button" onClick={() => onSelect('newChat')}>
          {labels.newChat[lang]}
        </button>
      </li>
      {functions.map(({ id }) => (
        <li key={id}>
          <button
            className={`sidebar-button ${selected === id ? 'active' : ''}`}
            onClick={() => onSelect(id)}
          >
            {labels[id][lang]}
          </button>
        </li>
      ))}
    </ul>
  </div>
);

export default FunctionSidebar;
