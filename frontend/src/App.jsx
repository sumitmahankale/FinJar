import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FinJarLanding from './Components/LandingPage';
import FinJarRegistration from './Components/RegistrationPage';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={
            <FinJarLanding 
              isDarkMode={isDarkMode} 
              toggleDarkMode={toggleDarkMode} 
            />
          } 
        />
        <Route 
          path="/registration" 
          element={
            <FinJarRegistration 
              isDarkMode={isDarkMode} 
            />
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;