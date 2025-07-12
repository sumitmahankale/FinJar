import React, { useState } from 'react';
import { Eye, EyeOff, ArrowRight, User, Mail, Lock } from 'lucide-react';

export default function FinJarRegistration({ isDarkMode = false }) {
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
    <div className={`min-h-screen w-full transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
    } relative overflow-hidden`}>
      {/* Main content */}
      <div className="w-full min-h-screen px-4 sm:px-6 lg:px-8 flex items-center">
        <div className="w-full">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center w-full">
            {/* Left side - Registration Form */}
            <div className="w-full space-y-6 lg:pr-8 flex flex-col items-center lg:items-center lg:pl-16">


              <div className="space-y-4 text-center lg:text-center">
                <h1 className={`text-4xl lg:text-5xl font-bold transition-colors duration-300 ${
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
                
                <p className={`text-lg leading-relaxed transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Start your savings journey today. Create your account and build better financial habits.
                </p>
              </div>

              {/* Registration Form */}
              <div className="space-y-4 w-full max-w-md mx-auto">
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
                    className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-md transition-all duration-200 hover:scale-110 ${
                      isDarkMode 
                        ? 'text-gray-400 hover:text-blue-400 hover:bg-gray-700' 
                        : 'text-gray-500 hover:text-blue-600 hover:bg-gray-100'
                    }`}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
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
                    className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-md transition-all duration-200 hover:scale-110 ${
                      isDarkMode 
                        ? 'text-gray-400 hover:text-blue-400 hover:bg-gray-700' 
                        : 'text-gray-500 hover:text-blue-600 hover:bg-gray-100'
                    }`}
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {/* Submit Button */}
                <button
                  type="button"
                  onClick={handleSubmit}
                  className={`w-full px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center space-x-2 ${
                    isDarkMode 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25' 
                      : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg'
                  }`}
                >
                  <span>Create Account</span>
                  <ArrowRight size={20} />
                </button>

                {/* Sign In Link */}
                <div className="text-center pt-2">
                  <span className={`transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Already have an account?{' '}
                    <button 
                      onClick={handleSignInClick}
                      className={`font-medium transition-colors duration-300 underline-offset-2 hover:underline ${
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
            <div className="w-full flex justify-center">
              <div className="w-full max-w-md lg:max-w-lg">
                <img 
                  src="\ChatGPT Image Jul 12, 2025, 08_58_13 AM.png" 
                  alt="FinJar App Interface" 
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-1/4 left-0 w-32 h-32 bg-blue-500 rounded-full opacity-10 blur-xl transform -translate-x-1/2"></div>
      <div className="absolute bottom-1/4 right-0 w-40 h-40 bg-blue-400 rounded-full opacity-10 blur-xl transform translate-x-1/2"></div>
      <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-purple-500 rounded-full opacity-5 blur-xl"></div>
    </div>
  );
}