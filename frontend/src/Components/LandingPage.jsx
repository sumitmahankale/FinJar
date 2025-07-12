import React, { useState } from 'react';
import { Target, PiggyBank, TrendingUp, Shield, Bell, Award, Zap, Users, Menu, X, Moon, Sun } from 'lucide-react';

// Navbar Component with smooth scrolling
const Navbar = ({ isDarkMode, toggleDarkMode }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
    setIsMenuOpen(false); // Close mobile menu after click
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 backdrop-blur-md ${
      isDarkMode ? 'bg-gray-900/80 border-gray-700' : 'bg-white/80 border-gray-200'
    } border-b`}>
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => scrollToSection('home')}>
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
            <button onClick={() => scrollToSection('home')} className={`transition-all duration-300 hover:scale-105 bg-transparent border-none ${
              isDarkMode ? 'text-blue-300 hover:text-blue-200' : 'text-blue-600 hover:text-blue-800'
            }`}>
              Home
            </button>
            <button onClick={() => scrollToSection('features')} className={`transition-all duration-300 hover:scale-105 bg-transparent border-none ${
              isDarkMode ? 'text-blue-300 hover:text-blue-200' : 'text-blue-600 hover:text-blue-800'
            }`}>
              Features
            </button>
            <button onClick={() => scrollToSection('about')} className={`transition-all duration-300 hover:scale-105 bg-transparent border-none ${
              isDarkMode ? 'text-blue-300 hover:text-blue-200' : 'text-blue-600 hover:text-blue-800'
            }`}>
              About
            </button>
            <button onClick={() => scrollToSection('contact')} className={`transition-all duration-300 hover:scale-105 bg-transparent border-none ${
              isDarkMode ? 'text-blue-300 hover:text-blue-200' : 'text-blue-600 hover:text-blue-800'
            }`}>
              Contact
            </button>
          </div>

          {/* Right side - Theme toggle */}
          <div className="flex items-center space-x-4">
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
              <button onClick={() => scrollToSection('home')} className={`text-left transition-colors duration-300 bg-transparent border-none ${
                isDarkMode ? 'text-blue-300 hover:text-blue-200' : 'text-blue-600 hover:text-blue-800'
              }`}>
                Home
              </button>
              <button onClick={() => scrollToSection('features')} className={`text-left transition-colors duration-300 bg-transparent border-none ${
                isDarkMode ? 'text-blue-300 hover:text-blue-200' : 'text-blue-600 hover:text-blue-800'
              }`}>
                Features
              </button>
              <button onClick={() => scrollToSection('about')} className={`text-left transition-colors duration-300 bg-transparent border-none ${
                isDarkMode ? 'text-blue-300 hover:text-blue-200' : 'text-blue-600 hover:text-blue-800'
              }`}>
                About
              </button>
              <button onClick={() => scrollToSection('contact')} className={`text-left transition-colors duration-300 bg-transparent border-none ${
                isDarkMode ? 'text-blue-300 hover:text-blue-200' : 'text-blue-600 hover:text-blue-800'
              }`}>
                Contact
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

// Features Component
const Features = ({ isDarkMode }) => {
  const features = [
    {
      icon: Target,
      title: "Goal-Based Savings",
      description: "Set specific savings goals and track your progress with visual jar representations.",
      color: "blue"
    },
    {
      icon: PiggyBank,
      title: "Smart Jar System",
      description: "Organize your savings into different jars for different purposes - vacation, emergency, gadgets.",
      color: "green"
    },
    {
      icon: TrendingUp,
      title: "Progress Tracking",
      description: "Monitor your savings journey with detailed analytics and milestone celebrations.",
      color: "purple"
    },
    {
      icon: Shield,
      title: "Secure & Safe",
      description: "Bank-grade security ensures your financial data is protected with advanced encryption.",
      color: "red"
    },
    {
      icon: Bell,
      title: "Smart Reminders",
      description: "Personalized notifications to keep you motivated and on track with your savings goals.",
      color: "yellow"
    },
    {
      icon: Award,
      title: "Achievement System",
      description: "Earn badges and rewards as you hit savings milestones and build consistent habits.",
      color: "indigo"
    },
    {
      icon: Zap,
      title: "Auto-Save",
      description: "Set up automatic transfers to your jars based on your income and spending patterns.",
      color: "orange"
    },
    {
      icon: Users,
      title: "Family Sharing",
      description: "Share savings goals with family members and save together towards common objectives.",
      color: "pink"
    }
  ];

  const getColorClasses = (color, isDarkMode) => {
    const colors = {
      blue: isDarkMode ? 'bg-blue-900/20 border-blue-500/30 text-blue-300' : 'bg-blue-50 border-blue-200 text-blue-600',
      green: isDarkMode ? 'bg-green-900/20 border-green-500/30 text-green-300' : 'bg-green-50 border-green-200 text-green-600',
      purple: isDarkMode ? 'bg-purple-900/20 border-purple-500/30 text-purple-300' : 'bg-purple-50 border-purple-200 text-purple-600',
      red: isDarkMode ? 'bg-red-900/20 border-red-500/30 text-red-300' : 'bg-red-50 border-red-200 text-red-600',
      yellow: isDarkMode ? 'bg-yellow-900/20 border-yellow-500/30 text-yellow-300' : 'bg-yellow-50 border-yellow-200 text-yellow-600',
      indigo: isDarkMode ? 'bg-indigo-900/20 border-indigo-500/30 text-indigo-300' : 'bg-indigo-50 border-indigo-200 text-indigo-600',
      orange: isDarkMode ? 'bg-orange-900/20 border-orange-500/30 text-orange-300' : 'bg-orange-50 border-orange-200 text-orange-600',
      pink: isDarkMode ? 'bg-pink-900/20 border-pink-500/30 text-pink-300' : 'bg-pink-50 border-pink-200 text-pink-600'
    };
    return colors[color] || colors.blue;
  };

  return (
    <section 
      id="features" 
      className={`py-20 transition-colors duration-300 ${
        isDarkMode ? 'bg-gray-900' : 'bg-white'
      }`}
    >
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 mb-4">
            <div className={`w-2 h-2 rounded-full ${isDarkMode ? 'bg-blue-400' : 'bg-blue-600'}`}></div>
            <span className={`text-sm font-medium tracking-wide uppercase ${
              isDarkMode ? 'text-blue-400' : 'text-blue-600'
            }`}>
              Features
            </span>
            <div className={`w-2 h-2 rounded-full ${isDarkMode ? 'bg-blue-400' : 'bg-blue-600'}`}></div>
          </div>
          
          <h2 className={`text-4xl lg:text-5xl font-bold mb-6 transition-colors duration-300 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Everything You Need to
            <br />
            <span className={`transition-colors duration-300 ${
              isDarkMode ? 'text-blue-400' : 'text-blue-600'
            }`}>
              Build Your Savings
            </span>
          </h2>
          
          <p className={`text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed transition-colors duration-300 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            FinJar combines powerful savings tools with an intuitive interface to make managing your money feel effortless and rewarding.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className={`group relative p-8 rounded-2xl border-2 transition-all duration-500 hover:scale-105 hover:shadow-xl ${
                  isDarkMode 
                    ? 'bg-gray-800/50 border-gray-700 hover:bg-gray-800 hover:border-gray-600' 
                    : 'bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                } backdrop-blur-sm`}
                style={{
                  animationDelay: `${index * 0.1}s`
                }}
              >
                {/* Animated Background Gradient */}
                <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-500 ${
                  isDarkMode ? 'bg-gradient-to-br from-blue-400 to-purple-600' : 'bg-gradient-to-br from-blue-500 to-purple-700'
                }`}></div>
                
                {/* Icon Container */}
                <div className={`relative w-16 h-16 rounded-xl mb-6 flex items-center justify-center border-2 transition-all duration-500 group-hover:scale-110 ${
                  getColorClasses(feature.color, isDarkMode)
                }`}>
                  <Icon size={28} className="transition-transform duration-500 group-hover:rotate-12" />
                </div>

                {/* Content */}
                <div className="relative">
                  <h3 className={`text-xl font-bold mb-3 transition-colors duration-300 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {feature.title}
                  </h3>
                  
                  <p className={`text-sm leading-relaxed transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {feature.description}
                  </p>
                </div>

                {/* Hover Arrow */}
                <div className={`absolute bottom-6 right-6 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 ${
                  isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-600 text-white'
                }`}>
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M13.025 1l-2.847 2.828 6.176 6.176h-16.354v3.992h16.354l-6.176 6.176 2.847 2.828 10.975-11z"/>
                  </svg>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className={`inline-flex items-center space-x-4 px-8 py-4 rounded-full transition-all duration-300 ${
            isDarkMode 
              ? 'bg-gray-800 border border-gray-700' 
              : 'bg-gray-50 border border-gray-200'
          }`}>
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full bg-blue-500 border-2 border-white"></div>
              <div className="w-8 h-8 rounded-full bg-green-500 border-2 border-white"></div>
              <div className="w-8 h-8 rounded-full bg-purple-500 border-2 border-white"></div>
              <div className="w-8 h-8 rounded-full bg-red-500 border-2 border-white"></div>
            </div>
            <span className={`text-sm font-medium ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Join 10,000+ users already saving smarter
            </span>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-1/4 right-0 w-64 h-64 bg-gradient-to-l from-blue-500 to-purple-600 rounded-full opacity-5 blur-3xl"></div>
      <div className="absolute bottom-1/4 left-0 w-48 h-48 bg-gradient-to-r from-green-500 to-blue-600 rounded-full opacity-5 blur-3xl"></div>
    </section>
  );
};

// Main Landing Page Component
export default function FinJarLanding({ isDarkMode, toggleDarkMode }) {

  const handleStartNowClick = () => {
    // Navigate to registration - you can implement this based on your routing
    console.log('Navigate to registration');
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      {/* Navbar */}
      <Navbar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />

      {/* Hero Section */}
      <section id="home" className={`pt-24 pb-12 min-h-screen flex items-center transition-colors duration-300 ${
        isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
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
      </section>

      {/* Features Section */}
      <Features isDarkMode={isDarkMode} />

      {/* Placeholder sections for About and Contact */}
      <section id="about" className={`py-20 transition-colors duration-300 ${
        isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
      }`}>
        <div className="container mx-auto px-6 text-center">
          <h2 className={`text-4xl font-bold mb-6 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>About FinJar</h2>
          <p className={`text-lg ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>Learn more about our mission and story...</p>
        </div>
      </section>

      <section id="contact" className={`py-20 transition-colors duration-300 ${
        isDarkMode ? 'bg-gray-900' : 'bg-white'
      }`}>
        <div className="container mx-auto px-6 text-center">
          <h2 className={`text-4xl font-bold mb-6 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>Get In Touch</h2>
          <p className={`text-lg ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>Contact us for support or questions...</p>
        </div>
      </section>
    </div>
  );
}