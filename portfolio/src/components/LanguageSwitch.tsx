import Button from '@mui/material/Button';

export interface LangProps {
  lang: 'en' | 'ja';
  setLang: (lang: 'en' | 'ja') => void;
}

export default function LanguageSwitch({ lang, setLang }: LangProps) {
  const toggleLang = () => setLang(lang === 'en' ? 'ja' : 'en');
  return (
    <Button color="inherit" onClick={toggleLang}>
      {lang === 'en' ? '日本語' : 'English'}
    </Button>
  );
}
