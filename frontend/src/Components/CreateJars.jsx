import React, { useState } from 'react';
import api from '../services/apiService.js';
import { 
  PiggyBank, 
  Plus, 
  Target,
  DollarSign,
  AlertCircle,
  CheckCircle,
  ArrowLeft
} from 'lucide-react';

const CreateJars = ({ isDarkMode = false, onNavigateBack }) => {
  const [formData, setFormData] = useState({
    title: '',
    targetAmount: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [validationErrors, setValidationErrors] = useState({});


  // Validate form data
  const validateForm = () => {
    const errors = {};
    
    if (!formData.title.trim()) {
      errors.title = 'Jar title is required';
    } else if (formData.title.trim().length < 3) {
      errors.title = 'Jar title must be at least 3 characters long';
    } else if (formData.title.trim().length > 50) {
      errors.title = 'Jar title must be less than 50 characters';
    }

    if (!formData.targetAmount) {
      errors.targetAmount = 'Target amount is required';
    } else {
      const amount = parseFloat(formData.targetAmount);
      if (isNaN(amount) || amount <= 0) {
        errors.targetAmount = 'Target amount must be a positive number';
      } else if (amount > 10000000) {
        errors.targetAmount = 'Target amount must be less than ₹1 crore';
      } else if (amount < 100) {
        errors.targetAmount = 'Target amount must be at least ₹100';
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
    
    // Clear general error and success messages
    setError('');
    setSuccess('');
  };

  // Create new jar
  const createJar = async () => {
    // Reset messages
    setError('');
    setSuccess('');

    // Validate form
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const payload = { title: formData.title.trim(), targetAmount: parseFloat(formData.targetAmount) };
      const data = await api.createJar(payload);
      if (data && (data.jar || data.success)) {
        setSuccess(`Jar "${formData.title}" created successfully! 🎉`);
        setFormData({ title: '', targetAmount: '' });
        setValidationErrors({});
        setTimeout(() => { onNavigateBack && onNavigateBack(); }, 1500);
      } else {
        setError('Unexpected response creating jar');
      }
    } catch (err) {
      console.error('Error creating jar:', err);
      setError(err.message || 'Error creating jar');
    } finally {
      setLoading(false);
    }
  };

  // Format currency for display
  const formatCurrency = (amount) => {
    if (!amount) return '0';
    return new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 2,
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className={`flex items-center justify-between p-6 border-b ${
        isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
      }`}>
        <div className="flex items-center space-x-4">
          {onNavigateBack && (
            <button
              onClick={onNavigateBack}
              className={`p-2 rounded-lg transition-colors ${
                isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              <ArrowLeft size={20} />
            </button>
          )}
          <div className="flex items-center space-x-3">
            <PiggyBank className="w-8 h-8 text-blue-600" />
            <div>
              <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Create New Jar
              </h2>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Set up your savings goal
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-2xl mx-auto space-y-6">
          
          {/* Success Message */}
          {success && (
            <div className={`p-4 rounded-lg flex items-start space-x-3 ${
              isDarkMode ? 'bg-green-900/20 border border-green-800' : 'bg-green-50 border border-green-200'
            }`}>
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className={`text-sm font-medium ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                  {success}
                </p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className={`p-4 rounded-lg flex items-start space-x-3 ${
              isDarkMode ? 'bg-red-900/20 border border-red-800' : 'bg-red-50 border border-red-200'
            }`}>
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className={`text-sm font-medium ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>
                  {error}
                </p>
              </div>
            </div>
          )}

          {/* Create Jar Form */}
          <div className={`p-8 rounded-xl ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'} shadow-sm`}>
            <div className="space-y-6">
              
              {/* Jar Title */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Jar Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="e.g., Emergency Fund, Vacation, New Car"
                  maxLength={50}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    validationErrors.title
                      ? 'border-red-500 ring-1 ring-red-500'
                      : isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-900'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors`}
                />
                {validationErrors.title && (
                  <p className="mt-1 text-sm text-red-500">{validationErrors.title}</p>
                )}
                <p className={`mt-1 text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                  {formData.title.length}/50 characters
                </p>
              </div>

              {/* Target Amount */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Target Amount (₹) *
                </label>
                <div className="relative">
                  <DollarSign className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                    isDarkMode ? 'text-gray-500' : 'text-gray-400'
                  }`} />
                  <input
                    type="number"
                    value={formData.targetAmount}
                    onChange={(e) => handleInputChange('targetAmount', e.target.value)}
                    placeholder="10000"
                    step="0.01"
                    min="100"
                    max="10000000"
                    className={`w-full pl-12 pr-4 py-3 rounded-lg border ${
                      validationErrors.targetAmount
                        ? 'border-red-500 ring-1 ring-red-500'
                        : isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'bg-white border-gray-300 text-gray-900'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors`}
                  />
                </div>
                {validationErrors.targetAmount && (
                  <p className="mt-1 text-sm text-red-500">{validationErrors.targetAmount}</p>
                )}
                {formData.targetAmount && !validationErrors.targetAmount && (
                  <p className={`mt-1 text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                    Formatted: ₹{formatCurrency(formData.targetAmount)}
                  </p>
                )}
              </div>

              {/* Preview */}
              {formData.title && formData.targetAmount && !validationErrors.title && !validationErrors.targetAmount && (
                <div className={`p-4 rounded-lg border-2 border-dashed ${
                  isDarkMode ? 'border-gray-600 bg-gray-700/50' : 'border-gray-300 bg-gray-50'
                }`}>
                  <h4 className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Preview:
                  </h4>
                  <div className="flex items-center space-x-3">
                    <PiggyBank className="w-6 h-6 text-blue-600" />
                    <div>
                      <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {formData.title}
                      </p>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Goal: ₹{formatCurrency(formData.targetAmount)}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-4 pt-4">
                <button
                  onClick={createJar}
                  disabled={loading || !formData.title || !formData.targetAmount}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 transition-colors font-medium"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Creating...</span>
                    </>
                  ) : (
                    <>
                      <Plus size={20} />
                      <span>Create Jar</span>
                    </>
                  )}
                </button>
                
                {onNavigateBack && (
                  <button
                    onClick={onNavigateBack}
                    disabled={loading}
                    className={`px-6 py-3 rounded-lg border transition-colors font-medium ${
                      isDarkMode 
                        ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Tips Section */}
          <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-blue-50 border border-blue-200'}`}>
            <h4 className={`text-lg font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-blue-900'}`}>
              💡 Tips for Creating Jars
            </h4>
            <ul className={`space-y-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-blue-800'}`}>
              <li>• Choose a specific, motivating title (e.g., "Dream Vacation to Japan")</li>
              <li>• Set realistic target amounts based on your income</li>
              <li>• Break large goals into smaller, achievable milestones</li>
              <li>• Consider setting up automatic deposits to reach your goal faster</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateJars;