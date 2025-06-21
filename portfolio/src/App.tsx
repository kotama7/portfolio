import Home from './components/home/home';

import { useState } from 'react';

import './App.css';


function App() {

  const [lang, setLang] = useState<string>('ja');

  return (
    <>
      <Home lang={lang} setLang={setLang} />
    </>
  );
}

export default App;
