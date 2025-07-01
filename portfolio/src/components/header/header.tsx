import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import LanguageSwitch from '../LanguageSwitch';

interface HeaderProps {
    lang: 'en' | 'ja';
    setLang: (lang: 'en' | 'ja') => void;
}

export default function Header(props: HeaderProps){
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar variant="dense">
                    <Typography variant="h6" color="inherit" component="div" sx={{ flexGrow: 1 }}>
                        {props.lang === 'en' ? 'Takanori Kotama' : '小玉 貴教'}
                    </Typography>
                    <LanguageSwitch lang={props.lang} setLang={props.setLang} />
                </Toolbar>
            </AppBar>
        </Box>
    );
}
