import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
export default function Header(props: {lang: string, setLang: (lang: string) => void}){

    }    

                    <Typography variant="h6" color="inherit" component="div">
                <Button onClick={changeLanguage}>
                    {props.lang === 'en' ? '日本語' : 'English'}
                </Button>
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
