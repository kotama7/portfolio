import React from 'react';

export interface FunctionSidebarProps {
  onSelect: (name: string) => void;
  selected?: string | null;
  onClose?: () => void;
  lang: 'en' | 'ja';
}

interface FunctionCategory {
  label: { en: string; ja: string };
  items: string[];
}

const categories: FunctionCategory[] = [
  {
    label: { en: 'Profile', ja: 'プロフィール' },
    items: ['briefIntro', 'profileInfo', 'bioGraph', 'qualifications', 'workExperience', 'awards'],
  },
  {
    label: { en: 'Skills & Interests', ja: 'スキル・興味' },
    items: ['skillTree', 'interestGraph', 'favoriteLanguage', 'spokenLanguages', 'devEnvironment'],
  },
  {
    label: { en: 'Research & Projects', ja: '研究・プロジェクト' },
    items: ['majorProjects', 'contributions', 'researchWorks', 'thesisSummary', 'fusepThesisSummary', 'graduationThesis'],
  },
  {
    label: { en: 'Other', ja: 'その他' },
    items: ['contactInfo', 'otherSiteLinks', 'portfolioSummary', 'futureGoals', 'aboutThisSite'],
  },
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
                                                                                                            
  greeting: { en: 'Hello!', ja: 'こんにちは！' },
  thankYou: { en: 'Thank you!', ja: 'ありがとう！' },
  goodbye: { en: 'Goodbye!', ja: 'さようなら！' },
  help: { en: 'What can I ask you?', ja: '何が聞けますか？' },
  aboutThisSite: { en: 'How was this site made?', ja: 'このサイトはどう作られた？' },
  qualifications: { en: 'Show qualifications', ja: '学歴・資格を教えて' },
  workExperience: { en: 'Show work experience', ja: '職歴・インターンを教えて' },
  awards: { en: 'Show awards', ja: '受賞歴を教えて' },
  futureGoals: { en: 'What are your future goals?', ja: '将来の目標は？' },
  spokenLanguages: { en: 'What languages do you speak?', ja: '何語が話せますか？' },
  devEnvironment: { en: 'What tools do you use?', ja: '開発環境を教えて' },

  newChat: { en: 'newChat', ja: '新しいチャット' },
};

const FunctionSidebar: React.FC<FunctionSidebarProps> = ({ onSelect, selected, onClose, lang }) => (
  <div className="sidebar">
    {onClose && (
      <button className="sidebar-close" onClick={onClose} aria-label="close sidebar">
        ×
      </button>
    )}
    <h3>{lang === 'en' ? 'Sample Chat' : 'サンプルチャット'}</h3>
    <div className="sidebar-scroll">
      <div className="sidebar-section">
        <button className="sidebar-button" onClick={() => onSelect('newChat')}>
          {labels.newChat[lang]}
        </button>
        <button
          className={`sidebar-button ${selected === 'help' ? 'active' : ''}`}
          onClick={() => onSelect('help')}
        >
          {labels.help[lang]}
        </button>
      </div>
      {categories.map((cat) => (
        <div key={cat.label.en} className="sidebar-section">
          <div className="sidebar-category-label">{cat.label[lang]}</div>
          {cat.items.map((id) => (
            <button
              key={id}
              className={`sidebar-button ${selected === id ? 'active' : ''}`}
              onClick={() => onSelect(id)}
            >
              {labels[id][lang]}
            </button>
          ))}
        </div>
      ))}
    </div>
  </div>
);

export default FunctionSidebar;
