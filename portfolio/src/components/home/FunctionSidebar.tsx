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

const functions: FunctionItem[] = [
  { id: 'bioGraph' },
  { id: 'skillTree' },
  { id: 'interestGraph' },
  { id: 'personalityRadar' },
  { id: 'contactInfo' },
  { id: 'portfolioSummary' },
  { id: 'otherSiteLinks' },
  { id: 'profileInfo' },
];

const labels: Record<string, { en: string; ja: string }> = {
  bioGraph: { en: 'Please explain your biography', ja: '経歴を教えてください' },
  skillTree: { en: 'Show me your skills', ja: 'スキルを見せてください' },
  interestGraph: { en: 'What are your interests?', ja: '興味を教えてください' },
  personalityRadar: {
    en: 'Show your personality traits',
    ja: '性格の特徴を見せてください',
  },
  contactInfo: { en: 'Provide your contact info', ja: '連絡先を教えてください' },
  portfolioSummary: { en: 'Summarize your portfolio', ja: 'ポートフォリオを要約してください' },
  otherSiteLinks: { en: 'Share other site links', ja: 'その他のリンクを教えてください' },
  profileInfo: { en: 'Profile summary and awards', ja: '概要と受賞など' },
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
