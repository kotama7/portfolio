import React from 'react';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';

interface FuncInfo {
  key: string;
  label: string;
}

const functions: FuncInfo[] = [
  { key: 'bioGraph', label: 'Biography Graph' },
  { key: 'skillTree', label: 'Skill Tree' },
  { key: 'interestGraph', label: 'Interest Graph' },
  { key: 'personalityRadar', label: 'Personality Radar' },
  { key: 'contactInfo', label: 'Contact Info' },
  { key: 'portfolioSummary', label: 'Portfolio Summary' },
];

interface FunctionSidebarProps {
  open: boolean;
  onClose: () => void;
  onSelect: (func: string) => void;
}

const FunctionSidebar: React.FC<FunctionSidebarProps> = ({ open, onClose, onSelect }) => {
  const handleSelect = (func: string) => {
    onSelect(func);
    onClose();
  };

  return (
    <Drawer anchor="left" open={open} onClose={onClose}>
      <List sx={{ width: 250 }}>
        {functions.map((func) => (
          <ListItem key={func.key} disablePadding>
            <ListItemButton onClick={() => handleSelect(func.key)}>
              <ListItemText primary={func.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default FunctionSidebar;
