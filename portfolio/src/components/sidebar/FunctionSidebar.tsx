import React from 'react';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';

const functions = [
  'bioGraph',
  'skillTree',
  'interestGraph',
  'personalityRadar',
  'contactInfo',
  'portfolioSummary',
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
          <ListItem key={func} disablePadding>
            <ListItemButton onClick={() => handleSelect(func)}>
              <ListItemText primary={func} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default FunctionSidebar;
