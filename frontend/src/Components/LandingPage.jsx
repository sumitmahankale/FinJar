import React, { useState } from 'react';
import { Moon, Sun } from 'lucide-react';

export default function FinJarLanding() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      {/* Header with theme toggle */}
      <header className="flex justify-end p-6">
        <button
          onClick={toggleDarkMode}
          className={`p-3 rounded-full transition-all duration-300 ${
            isDarkMode 
              ? 'bg-gray-800 hover:bg-gray-700 text-yellow-400' 
              : 'bg-white hover:bg-gray-100 text-gray-700 shadow-md'
          }`}
        >
          {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
        </button>
      </header>

      {/* Main content */}
      <div className="container mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Text content */}
          <div className="space-y-8 lg:pl-12">
            <div className="space-y-6">
              <h1 className={`text-5xl lg:text-6xl font-bold transition-colors duration-300 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                <span className={`transition-colors duration-300 ${
                  isDarkMode ? 'text-blue-400' : 'text-blue-600'
                }`}>FinJar</span>
                <br />
                <span className={`transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Your Personalized
                  <br />
                  Savings
                  <br />
                  Companion
                </span>
              </h1>
              
              <p className={`text-lg lg:text-xl leading-relaxed transition-colors duration-300 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                FinJar is a goal-based fintech app that helps individuals build strong savings habits — one jar at a time.
              </p>
            </div>

            <button className={`px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 ${
              isDarkMode 
                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25' 
                : 'bg-gray-800 hover:bg-gray-900 text-white shadow-lg'
            }`}>
              START NOW
            </button>
          </div>

          {/* Right side - Image */}
          <div className="flex justify-center">
            <div className="w-full max-w-lg">
              <img 
                src="\mobile-application.png" 
                alt="FinJar App Interface" 
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-1/2 left-0 w-32 h-32 bg-blue-500 rounded-full opacity-10 blur-xl transform -translate-y-1/2"></div>
      <div className="absolute bottom-1/4 right-0 w-40 h-40 bg-blue-400 rounded-full opacity-10 blur-xl"></div>
    </div>
  );
}