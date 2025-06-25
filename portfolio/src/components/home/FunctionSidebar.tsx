import React from 'react';

export interface FunctionSidebarProps {
  onSelect: (name: string) => void;
  selected?: string | null;
  onClose?: () => void;
}

const functions = [
  'bioGraph',
  'skillTree',
  'interestGraph',
  'personalityRadar',
  'contactInfo',
  'portfolioSummary',
  'otherSiteLinks',
  'newChat',
];

const FunctionSidebar: React.FC<FunctionSidebarProps> = ({ onSelect, selected, onClose }) => (
  <div className="sidebar">
    {onClose && (
      <button className="sidebar-close" onClick={onClose} aria-label="close sidebar">
        ×
      </button>
    )}
    <h3>Functions</h3>
    <ul>
      {functions.map((name) => (
        <li key={name}>
          <button
            className={`sidebar-button ${selected === name ? 'active' : ''}`}
            onClick={() => onSelect(name)}
          >
            {name}
          </button>
        </li>
      ))}
    </ul>
  </div>
);

export default FunctionSidebar;
