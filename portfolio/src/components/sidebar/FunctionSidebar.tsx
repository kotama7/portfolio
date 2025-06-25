import React from 'react';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';

interface FunctionSidebarProps {
  open: boolean;
  onClose: () => void;
  onSelect: (funcName: string) => void;
}

const FUNCTIONS = [
  'bioGraph',
  'skillTree',
  'interestGraph',
  'personalityRadar',
  'contactInfo',
  'portfolioSummary',
  'otherSiteLinks',
];

export default function FunctionSidebar({ open, onClose, onSelect }: FunctionSidebarProps) {
  const handleClick = (name: string) => {
    onSelect(name);
    onClose();
  };

  return (
    <Drawer anchor="left" open={open} onClose={onClose}>
      <List sx={{ width: 250 }}>
        {FUNCTIONS.map((name) => (
          <ListItem key={name} disablePadding>
            <ListItemButton onClick={() => handleClick(name)}>
              <ListItemText primary={name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}
