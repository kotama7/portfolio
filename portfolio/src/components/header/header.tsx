import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import LanguageSwitch from '../LanguageSwitch';

interface HeaderProps {
  lang: string;
  setLang: (lang: string) => void;
  openSidebar: () => void;
}

export default function Header(props: HeaderProps){

    const changeLanguage = () => {
        if (props.lang === 'en') {
            props.setLang('ja');
        } else {
            props.setLang('en');
        }
    }    

}
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar variant="dense">
                    <Typography variant="h6" color="inherit" component="div" sx={{ flexGrow: 1 }}>
                        Takanori Kotama
                    </Typography>
                    <Button color="inherit" onClick={props.openSidebar}>Menu</Button>
                    <Button color="inherit" onClick={changeLanguage}>
                        {props.lang === 'en' ? '日本語' : 'English'}
                    </Button>
                </Toolbar>
            </AppBar>
        </Box>
    );
}
