import React, { useState } from 'react';
import { Menu, X, Eye, EyeOff, ArrowRight, User, Mail, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ isDarkMode }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleHomeClick = () => {
    navigate('/');
  };

  return (
    <nav className={`w-full transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
    } border-b`}>
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2 cursor-pointer" onClick={handleHomeClick}>
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
            <button onClick={handleHomeClick} className={`transition-colors duration-300 hover:scale-105 ${
              isDarkMode ? 'text-blue-300 hover:text-blue-200' : 'text-blue-600 hover:text-blue-800'
            }`}>
              Home
            </button>
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

          {/* Right side - Sign In */}
          <div className="flex items-center space-x-4">
            {/* Sign In Button - Desktop */}
            <button className={`hidden md:block px-6 py-2 rounded-lg font-medium transition-all duration-300 ${
              isDarkMode 
                ? 'text-blue-400 hover:bg-gray-800' 
                : 'text-blue-600 hover:bg-gray-100'
            }`}>
              Sign In
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
              <button onClick={handleHomeClick} className={`text-left transition-colors duration-300 ${
                isDarkMode ? 'text-blue-300 hover:text-blue-200' : 'text-blue-600 hover:text-blue-800'
              }`}>
                Home
              </button>
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
              <button className={`w-full mt-4 px-6 py-2 rounded-lg font-medium transition-all duration-300 text-left ${
                isDarkMode 
                  ? 'text-blue-400 hover:bg-gray-800' 
                  : 'text-blue-600 hover:bg-gray-100'
              }`}>
                Sign In
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default function FinJarRegistration({ isDarkMode }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    console.log('Registration data:', formData);
    // Handle registration logic here
  };

  const handleSignInClick = () => {
    // Navigate to sign in page or show sign in modal
    console.log('Navigate to sign in');
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      {/* Navbar */}
      <Navbar isDarkMode={isDarkMode} />

      {/* Main content */}
      <div className="container mx-auto px-6 py-12 min-h-[calc(100vh-80px)] flex items-center">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Registration Form */}
          <div className="space-y-8 lg:pl-12">
            <div className="space-y-6">
              <h1 className={`text-5xl lg:text-6xl font-bold transition-colors duration-300 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                <span className={`transition-colors duration-300 ${
                  isDarkMode ? 'text-blue-400' : 'text-blue-600'
                }`}>Join</span>
                <br />
                <span className={`transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  FinJar
                </span>
              </h1>
              
              <p className={`text-lg lg:text-xl leading-relaxed transition-colors duration-300 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Start your savings journey today. Create your account and build better financial habits.
              </p>
            </div>

            {/* Registration Form */}
            <div className="space-y-6 max-w-md">
              {/* Name Field */}
              <div className="relative">
                <User className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`} />
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-all duration-300 ${
                    isDarkMode 
                      ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                  }`}
                  required
                />
              </div>

              {/* Email Field */}
              <div className="relative">
                <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`} />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-all duration-300 ${
                    isDarkMode 
                      ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                  }`}
                  required
                />
              </div>

              {/* Password Field */}
              <div className="relative">
                <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-12 py-3 rounded-lg border transition-all duration-300 ${
                    isDarkMode 
                      ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                  }`}
                  required
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
                    isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {/* Confirm Password Field */}
              <div className="relative">
                <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`} />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-12 py-3 rounded-lg border transition-all duration-300 ${
                    isDarkMode 
                      ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                  }`}
                  required
                />
                <button
                  type="button"
                  onClick={toggleConfirmPasswordVisibility}
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
                    isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="button"
                onClick={handleSubmit}
                className={`w-full px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 ${
                  isDarkMode 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg'
                }`}
              >
                <span>Create Account</span>
                <ArrowRight size={20} />
              </button>

              {/* Sign In Link */}
              <div className="text-center">
                <span className={`transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Already have an account?{' '}
                  <button 
                    onClick={handleSignInClick}
                    className={`font-medium transition-colors duration-300 ${
                      isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'
                    }`}
                  >
                    Sign In
                  </button>
                </span>
              </div>
            </div>
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