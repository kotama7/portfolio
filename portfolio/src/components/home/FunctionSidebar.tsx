import React from 'react';

export interface FunctionSidebarProps {
  onSelect: (name: string) => void;
  selected?: string | null;
}

const functions = [
  'bioGraph',
  'skillTree',
  'interestGraph',
  'personalityRadar',
  'contactInfo',
  'portfolioSummary',
  'otherSiteLinks',
];

const FunctionSidebar: React.FC<FunctionSidebarProps> = ({ onSelect, selected }) => (
  <div className="sidebar">
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
