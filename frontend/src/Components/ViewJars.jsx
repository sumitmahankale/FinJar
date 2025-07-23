import React, { useState, useEffect } from 'react';
import { 
  PiggyBank, 
  Plus, 
  Edit3, 
  Trash2, 
  TrendingUp, 
  Calendar,
  DollarSign,
  Target,
  AlertCircle,
  CheckCircle,
  Clock,
  X,
  Save
} from 'lucide-react';

// API Service for Jar operations
const jarAPI = {
  // Get all jars for current user
  getMyJars: async () => {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('No authentication token');

    try {
      const response = await fetch('/api/jars', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        // Check if response is HTML (404 page, etc.)
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('text/html')) {
          throw new Error(`API endpoint not found (${response.status}). Make sure your Spring Boot server is running on the correct URL.`);
        }
        throw new Error(`Failed to fetch jars: ${response.status} ${response.statusText}`);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server returned non-JSON response. Check if the API endpoint is correct.');
      }

      return await response.json();
    } catch (error) {
      if (error.name === 'SyntaxError' && error.message.includes('Unexpected token')) {
        throw new Error('Server returned HTML instead of JSON. This usually means the API endpoint is not found or the server is not running.');
      }
      throw error;
    }
  },

  // Create new jar
  createJar: async (jarData) => {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('No authentication token');

    try {
      const response = await fetch('/api/jars', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jarData),
      });

      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('text/html')) {
          throw new Error(`API endpoint not found (${response.status}). Make sure your Spring Boot server is running.`);
        }
        throw new Error(`Failed to create jar: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      if (error.name === 'SyntaxError' && error.message.includes('Unexpected token')) {
        throw new Error('Server returned HTML instead of JSON. Check if your Spring Boot server is running.');
      }
      throw error;
    }
  },

  // Update jar
  updateJar: async (jarId, jarData) => {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('No authentication token');

    try {
      const response = await fetch(`/api/jars/${jarId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jarData),
      });

      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('text/html')) {
          throw new Error(`API endpoint not found (${response.status})`);
        }
        throw new Error(`Failed to update jar: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      if (error.name === 'SyntaxError' && error.message.includes('Unexpected token')) {
        throw new Error('Server returned HTML instead of JSON. Check if your Spring Boot server is running.');
      }
      throw error;
    }
  },

  // Delete jar
  deleteJar: async (jarId) => {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('No authentication token');

    try {
      const response = await fetch(`/api/jars/${jarId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('text/html')) {
          throw new Error(`API endpoint not found (${response.status})`);
        }
        throw new Error(`Failed to delete jar: ${response.status} ${response.statusText}`);
      }

      return await response.text();
    } catch (error) {
      if (error.name === 'SyntaxError' && error.message.includes('Unexpected token')) {
        throw new Error('Server returned HTML instead of JSON. Check if your Spring Boot server is running.');
      }
      throw error;
    }
  }
};

// Deposit API Service
const depositAPI = {
  // Add deposit to jar
  addDeposit: async (jarId, userId, depositData) => {
    try {
      const response = await fetch(`/api/deposits/jar/${jarId}/user/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(depositData),
      });

      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('text/html')) {
          throw new Error(`API endpoint not found (${response.status}). Check if your Spring Boot server is running.`);
        }
        throw new Error(`Failed to add deposit: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      if (error.name === 'SyntaxError' && error.message.includes('Unexpected token')) {
        throw new Error('Server returned HTML instead of JSON. Check if your Spring Boot server is running.');
      }
      throw error;
    }
  },

  // Get deposits for jar
  getDepositsForJar: async (jarId) => {
    try {
      const response = await fetch(`/api/deposits/jar/${jarId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('text/html')) {
          throw new Error(`API endpoint not found (${response.status})`);
        }
        throw new Error(`Failed to fetch deposits: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      if (error.name === 'SyntaxError' && error.message.includes('Unexpected token')) {
        throw new Error('Server returned HTML instead of JSON. Check if your Spring Boot server is running.');
      }
      throw error;
    }
  }
};

// Utility function to get user ID from JWT token
const getUserIdFromToken = () => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) return null;
    
    const payload = token.split('.')[1];
    const decodedPayload = JSON.parse(atob(payload));
    return decodedPayload.userId || decodedPayload.sub || decodedPayload.jti || 'demo-user';
  } catch (error) {
    console.error('Error parsing JWT:', error);
    return 'demo-user';
  }
};

// Loading Component
const LoadingSpinner = ({ isDarkMode, message = "Loading..." }) => (
  <div className="flex items-center justify-center py-12">
    <div className="text-center">
      <div className={`w-8 h-8 border-2 border-t-blue-600 border-r-transparent rounded-full animate-spin mb-3 ${
        isDarkMode ? 'border-gray-700' : 'border-gray-200'
      }`}></div>
      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
        {message}
      </p>
    </div>
  </div>
);

// Error Message Component
const ErrorMessage = ({ message, isDarkMode, onRetry }) => (
  <div className="flex items-center justify-center py-12">
    <div className="text-center max-w-md">
      <div className={`w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center ${
        isDarkMode ? 'bg-red-900 text-red-400' : 'bg-red-100 text-red-600'
      }`}>
        <AlertCircle className="w-6 h-6" />
      </div>
      <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
        {message}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  </div>
);

// Progress Bar Component
const ProgressBar = ({ current, target, isDarkMode }) => {
  const percentage = target > 0 ? Math.min((current / target) * 100, 100) : 0;
  
  return (
    <div className="w-full">
      <div className={`w-full bg-gray-200 rounded-full h-2 ${
        isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
      }`}>
        <div 
          className="bg-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <div className="flex justify-between mt-1">
        <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          ${current?.toLocaleString() || '0'}
        </span>
        <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          {percentage.toFixed(1)}%
        </span>
        <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          ${target?.toLocaleString() || '0'}
        </span>
      </div>
    </div>
  );
};

// Update Amount Modal
const UpdateAmountModal = ({ isOpen, jar, onClose, onUpdate, isDarkMode }) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setAmount('');
      setDescription('');
      setError('');
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const userId = getUserIdFromToken();
      const depositData = {
        amount: parseFloat(amount),
        description: description || 'Deposit added'
      };

      await depositAPI.addDeposit(jar.id, userId, depositData);
      onUpdate();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to add deposit');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      
      <div className={`relative w-full max-w-md rounded-2xl shadow-2xl ${
        isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
      }`}>
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 p-1 rounded-full transition-colors ${
            isDarkMode ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
          }`}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6">
          <h3 className={`text-xl font-semibold mb-4 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Add Money to {jar.jarName}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Amount ($)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
                placeholder="0.00"
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Description (Optional)
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
                placeholder="e.g., Monthly savings"
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                  isDarkMode 
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading || !amount}
                className="flex-1 py-2 px-4 rounded-lg font-medium bg-blue-600 hover:bg-blue-700 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Adding...</span>
                  </>
                ) : (
                  <span>Add Money</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Delete Confirmation Modal
const DeleteConfirmModal = ({ isOpen, jar, onClose, onConfirm, isDarkMode, isLoading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={!isLoading ? onClose : undefined} />
      
      <div className={`relative w-full max-w-md rounded-2xl shadow-2xl ${
        isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
      }`}>
        {!isLoading && (
          <button
            onClick={onClose}
            className={`absolute top-4 right-4 p-1 rounded-full transition-colors ${
              isDarkMode ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        )}

        <div className="p-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-red-100">
              <AlertCircle className="w-6 h-6 text-red-500" />
            </div>
          </div>

          <h3 className={`text-xl font-semibold mb-2 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Delete Jar
          </h3>

          <p className={`text-sm mb-6 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Are you sure you want to delete "{jar?.jarName}"? This action cannot be undone.
          </p>

          <div className="flex space-x-3">
            <button
              onClick={onClose}
              disabled={isLoading}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 ${
                isDarkMode 
                  ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className="flex-1 py-2 px-4 rounded-lg font-medium bg-red-600 hover:bg-red-700 text-white transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Deleting...</span>
                </>
              ) : (
                <span>Delete</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Individual Jar Card Component
const JarCard = ({ jar, isDarkMode, onUpdate, onDelete }) => {
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const getStatusIcon = (jar) => {
    const percentage = jar.targetAmount > 0 ? (jar.currentAmount / jar.targetAmount) * 100 : 0;
    
    if (percentage >= 100) {
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    } else if (percentage >= 50) {
      return <TrendingUp className="w-5 h-5 text-blue-500" />;
    } else {
      return <Clock className="w-5 h-5 text-orange-500" />;
    }
  };

  const getStatusText = (jar) => {
    const percentage = jar.targetAmount > 0 ? (jar.currentAmount / jar.targetAmount) * 100 : 0;
    
    if (percentage >= 100) return "Goal Achieved!";
    if (percentage >= 75) return "Almost There!";
    if (percentage >= 50) return "Good Progress";
    if (percentage >= 25) return "Getting Started";
    return "Just Started";
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await jarAPI.deleteJar(jar.id);
      onDelete(jar.id);
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Failed to delete jar:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className={`rounded-xl shadow-sm border transition-all duration-200 hover:shadow-md ${
        isDarkMode 
          ? 'bg-gray-800 border-gray-700 hover:bg-gray-750' 
          : 'bg-white border-gray-200 hover:bg-gray-50'
      }`}>
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                <PiggyBank className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className={`text-lg font-semibold ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {jar.jarName}
                </h3>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(jar)}
                  <span className={`text-sm ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {getStatusText(jar)}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setShowUpdateModal(true)}
                className={`p-2 rounded-lg transition-colors ${
                  isDarkMode 
                    ? 'text-gray-400 hover:text-blue-400 hover:bg-gray-700' 
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
                title="Add Money"
              >
                <Plus className="w-4 h-4" />
              </button>
              <button
                onClick={() => setShowDeleteModal(true)}
                className={`p-2 rounded-lg transition-colors ${
                  isDarkMode 
                    ? 'text-gray-400 hover:text-red-400 hover:bg-gray-700' 
                    : 'text-gray-600 hover:text-red-600 hover:bg-red-50'
                }`}
                title="Delete Jar"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Progress */}
          <div className="mb-4">
            <ProgressBar 
              current={jar.currentAmount} 
              target={jar.targetAmount} 
              isDarkMode={isDarkMode} 
            />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className={`p-3 rounded-lg ${
              isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
            }`}>
              <div className="flex items-center space-x-2 mb-1">
                <DollarSign className={`w-4 h-4 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`} />
                <span className={`text-xs font-medium ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Current
                </span>
              </div>
              <p className={`text-lg font-semibold ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                ${jar.currentAmount?.toLocaleString() || '0'}
              </p>
            </div>
            
            <div className={`p-3 rounded-lg ${
              isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
            }`}>
              <div className="flex items-center space-x-2 mb-1">
                <Target className={`w-4 h-4 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`} />
                <span className={`text-xs font-medium ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Target
                </span>
              </div>
              <p className={`text-lg font-semibold ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                ${jar.targetAmount?.toLocaleString() || '0'}
              </p>
            </div>
          </div>

          {/* Created Date */}
          {jar.createdAt && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-2">
                <Calendar className={`w-4 h-4 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`} />
                <span className={`text-xs ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Created {new Date(jar.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <UpdateAmountModal
        isOpen={showUpdateModal}
        jar={jar}
        onClose={() => setShowUpdateModal(false)}
        onUpdate={onUpdate}
        isDarkMode={isDarkMode}
      />

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        jar={jar}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        isDarkMode={isDarkMode}
        isLoading={isDeleting}
      />
    </>
  );
};

// Main View My Jars Component
export default function ViewMyJars() {
  const [isDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('isDarkMode');
    return savedTheme === 'true';
  });

  const [jars, setJars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchJars = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await jarAPI.getMyJars();
      setJars(data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch jars');
      console.error('Error fetching jars:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJars();
  }, []);

  const handleJarUpdate = () => {
    fetchJars(); // Refresh jars after update
  };

  const handleJarDelete = (jarId) => {
    setJars(jars.filter(jar => jar.id !== jarId));
  };

  if (loading) {
    return (
      <div className={`min-h-screen transition-colors duration-300 ${
        isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <LoadingSpinner isDarkMode={isDarkMode} message="Loading your jars..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen transition-colors duration-300 ${
        isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <ErrorMessage 
            message={error} 
            isDarkMode={isDarkMode} 
            onRetry={fetchJars}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-3xl font-bold mb-2 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            My Savings Jars
          </h1>
          <p className={`text-lg ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Track your progress and manage your savings goals
          </p>
        </div>

        {/* Stats Summary */}
        {jars.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className={`p-6 rounded-xl border ${
              isDarkMode 
                ? 'bg-gray-800 border-gray-700' 
                : 'bg-white border-gray-200'
            }`}>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                  <PiggyBank className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className={`text-2xl font-bold ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {jars.length}
                  </p>
                  <p className={`text-sm ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Total Jars
                  </p>
                </div>
              </div>
            </div>
            
            <div className={`p-6 rounded-xl border ${
              isDarkMode 
                ? 'bg-gray-800 border-gray-700' 
                : 'bg-white border-gray-200'
            }`}>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className={`text-2xl font-bold ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    ${jars.reduce((sum, jar) => sum + (jar.currentAmount || 0), 0).toLocaleString()}
                  </p>
                  <p className={`text-sm ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Total Saved
                  </p>
                </div>
              </div>
            </div>
            
            <div className={`p-6 rounded-xl border ${
              isDarkMode 
                ? 'bg-gray-800 border-gray-700' 
                : 'bg-white border-gray-200'
            }`}>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className={`text-2xl font-bold ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    ${jars.reduce((sum, jar) => sum + (jar.targetAmount || 0), 0).toLocaleString()}
                  </p>
                  <p className={`text-sm ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Total Goals
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Jars Grid */}
        {jars.length === 0 ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-center max-w-md">
              <div className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center ${
                isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
              }`}>
                <PiggyBank className={`w-12 h-12 ${
                  isDarkMode ? 'text-gray-600' : 'text-gray-400'
                }`} />
              </div>
              <h3 className={`text-xl font-semibold mb-2 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                No Jars Yet
              </h3>
              <p className={`text-sm mb-6 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Start your savings journey by creating your first jar. Set goals, track progress, and watch your money grow!
              </p>
              <div className="space-y-2">
                <button className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span>Create Your First Jar</span>
                </button>
                <p className={`text-xs ${
                  isDarkMode ? 'text-gray-500' : 'text-gray-500'
                }`}>
                  Go to "Create New Jar" to get started
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jars.map((jar) => (
              <JarCard
                key={jar.id}
                jar={jar}
                isDarkMode={isDarkMode}
                onUpdate={handleJarUpdate}
                onDelete={handleJarDelete}
              />
            ))}
          </div>
        )}

        {/* Refresh Button */}
        <div className="mt-8 text-center">
          <button
            onClick={fetchJars}
            disabled={loading}
            className={`px-6 py-2 rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed ${
              isDarkMode 
                ? 'bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700' 
                : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200'
            }`}
          >
            {loading ? 'Refreshing...' : 'Refresh Jars'}
          </button>
        </div>
      </div>
    </div>
  );
}