import React from 'react';

export interface FunctionSidebarProps {
  onSelect: (name: string) => void;
  selected?: string | null;
  onClose?: () => void;
}

interface FunctionItem {
  id: string;
  label: string;
}

const functions: FunctionItem[] = [
  { id: 'bioGraph', label: 'Please explain your biography' },
  { id: 'skillTree', label: 'Show me your skills' },
  { id: 'interestGraph', label: 'What are your interests?' },
  { id: 'personalityRadar', label: 'Show your personality traits' },
  { id: 'contactInfo', label: 'Provide your contact info' },
  { id: 'portfolioSummary', label: 'Summarize your portfolio' },
  { id: 'otherSiteLinks', label: 'Share other site links' },
];

const FunctionSidebar: React.FC<FunctionSidebarProps> = ({ onSelect, selected, onClose }) => (
  <div className="sidebar">
    {onClose && (
      <button className="sidebar-close" onClick={onClose} aria-label="close sidebar">
        ×
      </button>
    )}
    <h3>Sample Chat</h3>
    <ul>
      {functions.map(({ id, label }) => (
        <li key={id}>
          <button
            className={`sidebar-button ${selected === id ? 'active' : ''}`}
            onClick={() => onSelect(id)}
          >
            {label}
          </button>
        </li>
      ))}
    </ul>
  </div>
);

export default FunctionSidebar;
