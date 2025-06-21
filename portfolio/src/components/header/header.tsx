import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import LanguageSwitch from '../LanguageSwitch';

interface HeaderProps {
    lang: string;
    setLang: (lang: string) => void;
}

export default function Header(props: HeaderProps){

    const changeLanguage = () => {
        if (props.lang === 'en') {
            props.setLang('ja');
        } else {
            props.setLang('en');
        }
    }    

export default function Header(props: HeaderProps){
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar variant="dense">
                    <Typography variant="h6" color="inherit" component="div" sx={{ flexGrow: 1 }}>
                        {props.lang === 'en' ? 'Takanori Kotama' : '樹神 宇徳'}
                    </Typography>
                    <LanguageSwitch lang={props.lang} setLang={props.setLang} />
                </Toolbar>
            </AppBar>
        </Box>
    );
}
