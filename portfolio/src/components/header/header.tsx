import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import LanguageSwitch from '../LanguageSwitch';
import Switch from '@mui/material/Switch';
import { useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';

interface HeaderProps {
    lang: 'en' | 'ja';
    setLang: (lang: 'en' | 'ja') => void;
}

export default function Header(props: HeaderProps){
    const { theme, toggleTheme } = useContext(ThemeContext);
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar variant="dense">
                    <Typography variant="h6" color="inherit" component="div" sx={{ flexGrow: 1 }}>
                        {props.lang === 'en' ? 'Takanori Kotama' : '樹神 宇徳'}
                    </Typography>
                    <Switch checked={theme === 'dark'} onChange={toggleTheme} />
                    <LanguageSwitch lang={props.lang} setLang={props.setLang} />
                </Toolbar>
            </AppBar>
        </Box>
    );
}
