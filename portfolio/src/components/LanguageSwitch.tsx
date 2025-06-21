import Button from '@mui/material/Button';

export interface LangProps {
  lang: string;
  setLang: (lang: string) => void;
}

export interface LangOnlyProps {
  lang: string;
}

export default function LanguageSwitch({ lang, setLang }: LangProps) {
  const toggleLang = () => setLang(lang === 'en' ? 'ja' : 'en');
  return (
    <Button color="inherit" onClick={toggleLang}>
      {lang === 'en' ? '日本語' : 'English'}
    </Button>
  );
}
