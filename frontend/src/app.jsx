import React, { useState } from 'react';
import InputForm from './components/InputForm';
import ResultsView from './components/ResultsView';
import { generateFarmAdvice } from './services/api';
import './index.css';

function App() {
  const [farmData, setFarmData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState('en');

  const handleSetup = async (setupData) => {
    setIsLoading(true);
    try {
      const response = await generateFarmAdvice({ ...setupData, language });
      setFarmData(response);
    } catch (error) {
      console.error("Dashboard Generation Failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetSetup = () => {
    setFarmData(null);
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] flex items-center justify-center p-0 md:p-8 font-sans">
      {!farmData ? (
        <div className="w-full h-full md:h-auto flex items-center justify-center">
          <InputForm 
            onSubmit={handleSetup} 
            isLoading={isLoading} 
            language={language} 
            setLanguage={() => {
              setLanguage(l => {
                if (l === 'en') return 'hi';
                if (l === 'hi') return 'ta';
                return 'en';
              });
            }} 
          />
        </div>
      ) : (
        <ResultsView 
          data={farmData} 
          language={language} 
          onBack={resetSetup} 
        />
      )}
    </div>
  );
}

export default App;