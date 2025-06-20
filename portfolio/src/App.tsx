import Home from './components/home/home';
import Header from './components/header/header';
import BioTree from './components/bio/BioTree';

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
      <Home
        lang={lang}
      />
      <BioTree />
    </>
  );
}

export default App;
