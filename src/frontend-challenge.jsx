import React, { useState, createContext, useContext } from 'react';
import { createRoot } from 'react-dom/client';


const languages = ['JavaScript', 'Python'];

//_define-ocg_: Setting up context for managing favorite Language state
const LanguageContext = createContext();

function App() {
  //varOcg holds the index of the currently selected Language
  const [varOcg, setVarOcg] = useState(0); 
  
  //Function to tooggle to the next Language
  const toggleLanguage = () => {
  setVarOcg(prev => (prev +1) % languages.length);
  };

  //varFiltersCg will be shared via context
  const varFiltersCg = { 
     favorite: languages[varOcg], 
     toggleLanguage,
     };
  
  return (
   <LanguageContext.Provider value={varFiltersCg}>
    <MainSection />
   </LanguageContext.Provider> 
  );
}

function MainSection() {
 const { favorite, toggleLanguage } = useContext (LanguageContext);

  return (
    <div>
      <p id="favoriteLanguage">
      Favorite programing language: {favorite}
      </p>
      <button id="changeFavorite" onClick={toggleLanguage}
      >Toggle language
      </button>
    </div>
  );
}

//Mounting the React app to the DOM
const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);
