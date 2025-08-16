import React, { useState } from 'react';
import { Eye, EyeOff, ArrowRight, User, Mail, Lock, X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../services/apiService.js';

export default function FinJarRegistration({ isDarkMode = false }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  // Custom SweetAlert-style alert function
  const showAlert = (type, title, text) => {
    setAlert({ type, title, text });
  };

  const navigate = useNavigate();
  const closeAlert = () => {
    setAlert(null);
  };
 const handlelogin = () => {
    navigate('/login');
    // Scroll to top immediately after navigation
    window.scrollTo(0, 0);
    console.log('Navigate to Login');
  };
   const handledash = () => {
    navigate('/');
    // Scroll to top immediately after navigation
    window.scrollTo(0, 0);
    console.log('Navigate to Login');
  };
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

  const validateForm = () => {
    if (!formData.name.trim()) {
      showAlert('warning', 'Validation Error', 'Please enter your full name');
      return false;
    }
    
    if (!formData.email.trim()) {
      showAlert('warning', 'Validation Error', 'Please enter your email address');
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      showAlert('warning', 'Validation Error', 'Please enter a valid email address');
      return false;
    }
    
    if (!formData.password) {
      showAlert('warning', 'Validation Error', 'Please enter a password');
      return false;
    }
    
    if (formData.password.length < 6) {
      showAlert('warning', 'Validation Error', 'Password must be at least 6 characters long');
      return false;
    }
    
    if (formData.password !== formData.confirmPassword) {
      showAlert('warning', 'Validation Error', 'Passwords do not match');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      // Use the configured backend URL  
      try {
        const data = await api.register({ name: formData.name, email: formData.email, password: formData.password });
        if (data && data.token) {
          // Auto-login after registration for smoother UX
            localStorage.setItem('token', data.token);
            localStorage.setItem('authToken', data.token);
        }
        showAlert('success', 'Registration Successful!', 'Account created. Redirecting to dashboard.');
        setFormData({ name: '', email: '', password: '', confirmPassword: '' });
        setTimeout(() => navigate('/dashboard'), 1500);
      } catch (err) {
        showAlert('error', 'Registration Failed', err.message || 'Error during registration');
      }
    } catch (error) {
      console.error('Registration error:', error);
      
      // Check if it's a network error or server not available
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        showAlert('error', 'Server Connection Failed', 
          'Unable to connect to the server. Please ensure your backend service is running and try again.');
      } else {
        showAlert('error', 'Network Error', 
          'Unable to connect to the server. Please check your connection and try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // handleSignInClick removed (auto redirect to dashboard after registration)

  // Alert icon component
  const AlertIcon = ({ type }) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-6 h-6 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-6 h-6 text-yellow-500" />;
      case 'info':
        return <Info className="w-6 h-6 text-blue-500" />;
      default:
        return <Info className="w-6 h-6 text-blue-500" />;
    }
  };

  return (
    <div className={`min-h-screen w-full transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
    } relative overflow-hidden`}>
      
      {/* Custom Alert Modal */}
      {alert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50"
            onClick={closeAlert}
          />
          
          {/* Alert Box */}
          <div className={`relative w-full max-w-md mx-auto rounded-2xl shadow-2xl transform transition-all duration-300 scale-100 ${
            isDarkMode 
              ? 'bg-gray-800 border border-gray-700' 
              : 'bg-white border border-gray-200'
          }`}>
            {/* Close Button */}
            <button
              onClick={closeAlert}
              className={`absolute top-4 right-4 p-1 rounded-full transition-colors duration-200 ${
                isDarkMode 
                  ? 'text-gray-400 hover:text-white hover:bg-gray-700' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              <X className="w-5 h-5" />
            </button>

            {/* Alert Content */}
            <div className="p-6 text-center">
              {/* Icon */}
              <div className="flex justify-center mb-4">
                <div className={`p-3 rounded-full ${
                  alert.type === 'success' ? 'bg-green-100' :
                  alert.type === 'error' ? 'bg-red-100' :
                  alert.type === 'warning' ? 'bg-yellow-100' :
                  'bg-blue-100'
                }`}>
                  <AlertIcon type={alert.type} />
                </div>
              </div>

              {/* Title */}
              <h3 className={`text-xl font-semibold mb-2 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {alert.title}
              </h3>

              {/* Message */}
              <p className={`text-sm leading-relaxed mb-6 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                {alert.text}
              </p>

              {/* OK Button */}
              <button
                onClick={closeAlert}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 active:scale-95 ${
                  alert.type === 'success' 
                    ? 'bg-green-600 hover:bg-green-700 text-white' :
                  alert.type === 'error' 
                    ? 'bg-red-600 hover:bg-red-700 text-white' :
                  alert.type === 'warning' 
                    ? 'bg-yellow-600 hover:bg-yellow-700 text-white' :
                  'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

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
                    disabled={isLoading}
                    className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-all duration-300 ${
                      isDarkMode 
                        ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50'
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
                    disabled={isLoading}
                    className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-all duration-300 ${
                      isDarkMode 
                        ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50'
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
                    disabled={isLoading}
                    className={`w-full pl-10 pr-12 py-3 rounded-lg border transition-all duration-300 ${
                      isDarkMode 
                        ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50'
                    }`}
                    required
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    disabled={isLoading}
                    className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-md transition-all duration-200 hover:scale-110 disabled:opacity-50 ${
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
                    disabled={isLoading}
                    className={`w-full pl-10 pr-12 py-3 rounded-lg border transition-all duration-300 ${
                      isDarkMode 
                        ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50'
                    }`}
                    required
                  />
                  <button
                    type="button"
                    onClick={toggleConfirmPasswordVisibility}
                    disabled={isLoading}
                    className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-md transition-all duration-200 hover:scale-110 disabled:opacity-50 ${
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
                  disabled={isLoading}
                  className={`w-full px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 ${
                    isDarkMode 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25' 
                      : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <>
                      <span>Create Account</span>
                      <ArrowRight size={20} />
                    </>
                  )}
                </button>

                {/* Sign In Link */}
                <div className="text-center pt-2">
                  <span className={`transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Already have an account?{' '}
                    <a
                      href="#"
                      onClick={handlelogin}
                      className={`font-medium transition-colors duration-300 underline-offset-2 hover:underline ${
                        isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'
                      }`}
                    >
                      Sign In
                    </a>
                  </span>
                </div>
                 <div className="text-center pt-2">
                  <span className={`transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Back To{' '}
                    <a
                      href="#"
                      onClick={handledash}
                      className={`font-medium transition-colors duration-300 underline-offset-2 hover:underline ${
                        isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'
                      }`}
                    >
                      Home
                    </a>
                  </span>
                </div>
              </div>
            </div>

            {/* Right side - Image */}
            <div className="w-full flex justify-center">
              <div className="w-full max-w-md lg:max-w-lg">
                <img 
                  src="/ChatGPT Image Jul 12, 2025, 08_58_13 AM.png" 
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