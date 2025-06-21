import Home from './components/home/home';
import Header from './components/header/header';
import FunctionSidebar from './components/sidebar/FunctionSidebar';
import BioTree from './components/bio/BioTree';
import SkillTree from './components/skills/SkillTree';
import InterestGraph from './components/interests/InterestGraph';
import PersonalityRadar from './components/personality/PersonalityRadar';
import ContactInfo from './components/contact/ContactInfo';
import PortfolioSummary from './components/summary/PortfolioSummary';


import { useState } from 'react';

import './App.css';


function App() {

  const [lang, setLang] = useState<string>('ja');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedFunc, setSelectedFunc] = useState<string | null>(null);

  const renderSelected = () => {
    switch (selectedFunc) {
      case 'bioGraph':
        return <BioTree />;
      case 'skillTree':
        return <SkillTree />;
      case 'interestGraph':
        return <InterestGraph />;
      case 'personalityRadar':
        return <PersonalityRadar />;
      case 'contactInfo':
        return <ContactInfo />;
      case 'portfolioSummary':
        return <PortfolioSummary />;
      default:
        return null;
    }
  };

  return (
    <>
      <Header
        lang={lang}
        setLang={setLang}
        openSidebar={() => setSidebarOpen(true)}
      />
      <Home
        lang={lang}
        setLang={setLang}
      />
      <FunctionSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onSelect={(func) => setSelectedFunc(func)}
      />
      {renderSelected()}
    </>
  );
}

export default App;
