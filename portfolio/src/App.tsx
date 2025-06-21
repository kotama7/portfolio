import Home from './components/home/home';
import Header from './components/header/header';
import BioTree from './components/bio/BioTree';
import SkillTree from './components/skills/SkillTree';
import InterestGraph from './components/interests/InterestGraph';
import PersonalityRadar from './components/personality/PersonalityRadar';
import OtherSiteLinks from './components/links/OtherSiteLinks';

import { useState } from 'react';

import './App.css';


function App() {

  const [lang, setLang] = useState<string>('ja');

  return (
    <>
      <Header
        lang={lang}
        setLang={setLang}
      />
      <Home lang={lang} />
      <BioTree lang={lang} />
      <SkillTree lang={lang} />
      <InterestGraph lang={lang} />
      <PersonalityRadar lang={lang} />
      <OtherSiteLinks lang={lang} />
    </>
  );
}

export default App;
