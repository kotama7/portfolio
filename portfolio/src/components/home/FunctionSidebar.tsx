import React from 'react';

export interface FunctionSidebarProps {
  onSelect: (name: string) => void;
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

const FunctionSidebar: React.FC<FunctionSidebarProps> = ({ onSelect }) => (
  <div className="sidebar">
    <h3>Functions</h3>
    <ul>
      {functions.map((name) => (
        <li key={name}>
          <button onClick={() => onSelect(name)}>{name}</button>
        </li>
      ))}
    </ul>
  </div>
);

export default FunctionSidebar;
