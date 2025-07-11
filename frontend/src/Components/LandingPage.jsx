import React, { useState } from 'react';
import { Menu, X, Moon, Sun } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ isDarkMode, toggleDarkMode }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleGetStartedClick = () => {
    navigate('/registration');
  };

  return (
    <nav className={`w-full transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
    } border-b`}>
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              isDarkMode ? 'bg-blue-600' : 'bg-blue-600'
            }`}>
              <span className="text-white font-bold text-sm">FJ</span>
            </div>
            <span className={`text-xl font-bold transition-colors duration-300 ${
              isDarkMode ? 'text-blue-400' : 'text-blue-800'
            }`}>
              FinJar
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-14">
            <a href="#home" className={`transition-colors duration-300 hover:scale-105 ${
              isDarkMode ? 'text-blue-300 hover:text-blue-200' : 'text-blue-600 hover:text-blue-800'
            }`}>
              Home
            </a>
            <a href="#features" className={`transition-colors duration-300 hover:scale-105 ${
              isDarkMode ? 'text-blue-300 hover:text-blue-200' : 'text-blue-600 hover:text-blue-800'
            }`}>
              Features
            </a>
            <a href="#about" className={`transition-colors duration-300 hover:scale-105 ${
              isDarkMode ? 'text-blue-300 hover:text-blue-200' : 'text-blue-600 hover:text-blue-800'
            }`}>
              About
            </a>
            <a href="#contact" className={`transition-colors duration-300 hover:scale-105 ${
              isDarkMode ? 'text-blue-300 hover:text-blue-200' : 'text-blue-600 hover:text-blue-800'
            }`}>
              Contact
            </a>
          </div>

          {/* Right side - Theme toggle and CTA */}
          <div className="flex items-center space-x-4">
            {/* Get Started Button - Desktop */}
            <button 
              onClick={handleGetStartedClick}
              className={`hidden md:block px-6 py-2 rounded-lg font-medium transition-all duration-300 ${
                isDarkMode 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg'
              }`}
            >
              Get Started
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-full transition-all duration-300 ${
                isDarkMode 
                  ? 'bg-gray-800 hover:bg-gray-700 text-yellow-400' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={toggleMenu}
              className={`md:hidden p-2 rounded-lg transition-colors duration-300 ${
                isDarkMode ? 'text-blue-400 hover:bg-gray-800' : 'text-blue-600 hover:bg-gray-100'
              }`}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className={`md:hidden mt-4 py-4 border-t transition-colors duration-300 ${
            isDarkMode ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <div className="flex flex-col space-y-4">
              <a href="#home" className={`transition-colors duration-300 ${
                isDarkMode ? 'text-blue-300 hover:text-blue-200' : 'text-blue-600 hover:text-blue-800'
              }`}>
                Home
              </a>
              <a href="#features" className={`transition-colors duration-300 ${
                isDarkMode ? 'text-blue-300 hover:text-blue-200' : 'text-blue-600 hover:text-blue-800'
              }`}>
                Features
              </a>
              <a href="#about" className={`transition-colors duration-300 ${
                isDarkMode ? 'text-blue-300 hover:text-blue-200' : 'text-blue-600 hover:text-blue-800'
              }`}>
                About
              </a>
              <a href="#contact" className={`transition-colors duration-300 ${
                isDarkMode ? 'text-blue-300 hover:text-blue-200' : 'text-blue-600 hover:text-blue-800'
              }`}>
                Contact
              </a>
              <button 
                onClick={handleGetStartedClick}
                className={`w-full mt-4 px-6 py-2 rounded-lg font-medium transition-all duration-300 ${
                  isDarkMode 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg'
                }`}
              >
                Get Started
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default function FinJarLanding({ isDarkMode, toggleDarkMode }) {
  const navigate = useNavigate();

  const handleStartNowClick = () => {
    navigate('/registration');
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      {/* Navbar */}
      <Navbar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />

      {/* Main content */}
      <div className="container mx-auto px-6 py-12 min-h-[calc(100vh-80px)] flex items-center">
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

            <button 
              onClick={handleStartNowClick}
              className={`inline-flex items-center space-x-2 px-8 py-4 rounded-lg font-medium text-lg transition-all duration-300 transform hover:scale-105 ${
                isDarkMode 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg'
              }`}
            >
              <span>Start Now</span>
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm4.28 10.28a.75.75 0 000-1.06l-3-3a.75.75 0 10-1.06 1.06l1.72 1.72H8.25a.75.75 0 000 1.5h5.69l-1.72 1.72a.75.75 0 101.06 1.06l3-3z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>

          {/* Right side - Image */}
          <div className="flex justify-center">
            <div className="w-full max-w-lg">
              <img 
                src="/mobile-application.png" 
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