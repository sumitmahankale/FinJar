import React, { useState, useEffect } from 'react';
import { 
  PiggyBank, 
  Plus, 
  Trash2, 
  ArrowLeft,
  Calendar,
  DollarSign,
  Target,
  Activity,
  AlertCircle
} from 'lucide-react';

const ViewJars = ({ isDarkMode = false }) => {
  const [jars, setJars] = useState([]);
  const [selectedJar, setSelectedJar] = useState(null);
  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [depositAmount, setDepositAmount] = useState('');
  const [depositLoading, setDepositLoading] = useState(false);
  const [depositError, setDepositError] = useState('');

  // Get auth token
  const getAuthToken = () => {
    const token = localStorage.getItem('authToken');
    return token;
  };

  const getCurrentUser = () => {
    try {
      // Try different possible keys for user data
      const possibleKeys = ['user', 'currentUser', 'userData', 'authUser'];
      
      for (const key of possibleKeys) {
        const userData = localStorage.getItem(key);
        if (userData) {
          try {
            const parsedUser = JSON.parse(userData);
            // Ensure we have a numeric ID
            if (parsedUser.id && !isNaN(parsedUser.id)) {
              return parsedUser;
            }
          } catch (parseError) {
            console.warn(`Failed to parse user data from key '${key}':`, parseError);
          }
        }
      }
      
      // If no user found, try to extract from token
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          const parts = token.split('.');
          if (parts.length === 3) {
            const payload = JSON.parse(atob(parts[1]));
            console.log('Token payload:', payload);
            
            // Try different possible user ID fields in the token
            const userId = payload.userId || payload.user_id || payload.sub || payload.id;
            const userEmail = payload.email || payload.sub;
            
            if (userId) {
              return { 
                id: userId, 
                email: userEmail || payload.email,
                ...payload 
              };
            }
            
            // If we have email but no explicit user ID, we'll need to fetch it
            if (userEmail) {
              return { 
                email: userEmail, 
                needsUserIdFetch: true, 
                ...payload 
              };
            }
          }
        } catch (tokenError) {
          console.warn('Failed to extract user from token:', tokenError);
        }
      }
      
      return null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  };

  // Enhanced function to get numeric user ID from various sources
  const getNumericUserId = async () => {
    try {
      const token = getAuthToken();
      if (!token) return null;

      // First, try to get from stored user data
      let user = getCurrentUser();
      if (user && user.id && !isNaN(user.id)) {
        console.log('Found numeric user ID from stored data:', user.id);
        return parseInt(user.id);
      }

      // Method 1: Try to get user profile from backend
      try {
        console.log('Attempting to fetch user profile...');
        const response = await fetch('http://localhost:8080/api/users/profile', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const userData = await response.json();
          console.log('User profile data:', userData);
          if (userData.id && !isNaN(userData.id)) {
            const numericId = parseInt(userData.id);
            // Store the complete user data for future use
            localStorage.setItem('currentUser', JSON.stringify({...user, ...userData, id: numericId}));
            console.log('Got numeric user ID from profile:', numericId);
            return numericId;
          }
        }
      } catch (profileError) {
        console.log('Profile API not available:', profileError);
      }

      // Method 2: Extract user ID from jars data
      try {
        console.log('Trying to extract user ID from jars...');
        const response = await fetch('http://localhost:8080/api/jars', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const jarsData = await response.json();
          console.log('Jars data for user ID extraction:', jarsData);
          
          if (jarsData && jarsData.length > 0) {
            // Try different possible fields where user ID might be stored
            const jar = jarsData[0];
            const possibleUserIdFields = [
              'userId', 'user_id', 'ownerId', 'owner_id', 
              'createdBy', 'created_by', 'userID', 'ownerID'
            ];
            
            for (const field of possibleUserIdFields) {
              const userId = jar[field];
              if (userId && !isNaN(userId)) {
                const numericId = parseInt(userId);
                console.log(`Found numeric user ID from jars.${field}:`, numericId);
                // Store the user ID for future use
                localStorage.setItem('currentUser', JSON.stringify({...user, id: numericId}));
                return numericId;
              }
            }
            
            // If no direct user ID field, check if there's a nested user object
            if (jar.user && jar.user.id && !isNaN(jar.user.id)) {
              const numericId = parseInt(jar.user.id);
              console.log('Found numeric user ID from jar.user.id:', numericId);
              localStorage.setItem('currentUser', JSON.stringify({...user, id: numericId}));
              return numericId;
            }
          }
        }
      } catch (jarsError) {
        console.error('Error fetching user ID from jars:', jarsError);
      }

      // Method 3: Try to get from activities if available
      try {
        console.log('Trying to extract user ID from activities...');
        const response = await fetch('http://localhost:8080/api/activities', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const activitiesData = await response.json();
          console.log('Activities data for user ID extraction:', activitiesData);
          
          if (activitiesData && activitiesData.length > 0) {
            const activity = activitiesData[0];
            const possibleUserIdFields = [
              'userId', 'user_id', 'performedBy', 'performed_by', 
              'createdBy', 'created_by', 'userID'
            ];
            
            for (const field of possibleUserIdFields) {
              const userId = activity[field];
              if (userId && !isNaN(userId)) {
                const numericId = parseInt(userId);
                console.log(`Found numeric user ID from activities.${field}:`, numericId);
                localStorage.setItem('currentUser', JSON.stringify({...user, id: numericId}));
                return numericId;
              }
            }
          }
        }
      } catch (activitiesError) {
        console.log('Activities API not available:', activitiesError);
      }

      // Method 4: Try to get from deposits if available
      if (jars.length > 0) {
        try {
          console.log('Trying to extract user ID from deposits...');
          const response = await fetch(`http://localhost:8080/api/deposits/jar/${jars[0].id}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (response.ok) {
            const depositsData = await response.json();
            console.log('Deposits data for user ID extraction:', depositsData);
            
            if (depositsData && depositsData.length > 0) {
              const deposit = depositsData[0];
              const possibleUserIdFields = [
                'userId', 'user_id', 'depositorId', 'depositor_id',
                'createdBy', 'created_by', 'userID'
              ];
              
              for (const field of possibleUserIdFields) {
                const userId = deposit[field];
                if (userId && !isNaN(userId)) {
                  const numericId = parseInt(userId);
                  console.log(`Found numeric user ID from deposits.${field}:`, numericId);
                  localStorage.setItem('currentUser', JSON.stringify({...user, id: numericId}));
                  return numericId;
                }
              }
            }
          }
        } catch (depositsError) {
          console.log('Deposits API not available:', depositsError);
        }
      }

      return null;
    } catch (error) {
      console.error('Error getting numeric user ID:', error);
      return null;
    }
  };

  // Fetch user's jars
  const fetchJars = async () => {
    try {
      setError(null);
      const token = getAuthToken();
      if (!token) {
        setError('No authentication token found. Please log in again.');
        return;
      }

      const response = await fetch('http://localhost:8080/api/jars', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Fetched jars:', data);
        setJars(data);
      } else if (response.status === 401) {
        setError('Authentication expired. Please log in again.');
      } else {
        setError(`Server responded with status: ${response.status}`);
      }
    } catch (err) {
      console.error('Error fetching jars:', err);
      setError('Unable to connect to server. Please make sure the backend is running on localhost:8080');
    } finally {
      setLoading(false);
    }
  };

  // Fetch deposits for a specific jar
  const fetchDeposits = async (jarId) => {
    try {
      const token = getAuthToken();
      if (!token) {
        console.error('No auth token found');
        return;
      }

      const response = await fetch(`http://localhost:8080/api/deposits/jar/${jarId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Fetched deposits:', data);
        setDeposits(data);
      } else {
        console.error(`Failed to fetch deposits: ${response.status} ${response.statusText}`);
      }
    } catch (err) {
      console.error('Error fetching deposits:', err);
    }
  };

  // Fetch activities for a specific jar
  const fetchActivities = async (jarId) => {
    try {
      const token = getAuthToken();
      if (!token) {
        console.error('No auth token found');
        return;
      }

      const response = await fetch(`http://localhost:8080/api/activities/jar/${jarId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        await response.json(); // Use it when needed
      } else {
        console.error(`Failed to fetch activities: ${response.status} ${response.statusText}`);
      }
    } catch (err) {
      console.error('Error fetching activities:', err);
    }
  };

  // Enhanced function to add deposit with comprehensive user ID resolution
  const addDeposit = async () => {
    setDepositError('');
    
    if (!depositAmount || !selectedJar) {
      setDepositError('Deposit amount or selected jar is missing.');
      return;
    }

    const amount = parseFloat(depositAmount);
    if (isNaN(amount) || amount <= 0) {
      setDepositError('Please enter a valid amount greater than 0.');
      return;
    }

    const token = getAuthToken();
    
    if (!token) {
      setDepositError('Authentication token not found. Please log in again.');
      return;
    }
    
    console.log('Starting deposit process...');
    setDepositLoading(true);

    try {
      // Get numeric user ID using all available methods
      const numericUserId = await getNumericUserId();
      
      if (!numericUserId) {
        setDepositError(
          'Unable to determine your numeric user ID. This might be because:\n' +
          '1. Your account data is incomplete\n' +
          '2. The backend database needs to be checked\n' +
          '3. You may need to log out and log in again\n\n' +
          'Please try logging out and back in, or contact support if the issue persists.'
        );
        return;
      }

      console.log(`Making deposit request for jar ${selectedJar.id} and user ${numericUserId}`);
      
      const response = await fetch(`http://localhost:8080/api/deposits/jar/${selectedJar.id}/user/${numericUserId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount,
          depositDate: new Date().toISOString().split('T')[0] // Format: YYYY-MM-DD
        })
      });

      if (response.ok) {
        setDepositAmount('');
        setDepositError('');
        console.log('Deposit added successfully!');
        // Refresh data
        await fetchDeposits(selectedJar.id);
        await fetchActivities(selectedJar.id);
        await fetchJars();
      } else {
        const errorText = await response.text();
        console.error(`Failed to add deposit: ${response.status} ${response.statusText}`, errorText);
        if (response.status === 401) {
          setDepositError('Authentication expired. Please log out and log in again.');
        } else if (response.status === 403) {
          setDepositError('You do not have permission to add deposits to this jar.');
        } else if (response.status === 400) {
          setDepositError(`Invalid request: ${errorText}. Please check your input and try again.`);
        } else if (response.status === 404) {
          setDepositError('Jar or user not found. Please refresh the page and try again.');
        } else {
          setDepositError(`Failed to add deposit: Server error (${response.status}). ${errorText}`);
        }
      }
    } catch (err) {
      console.error('Error adding deposit:', err);
      setDepositError('Network error. Please check your connection and try again.');
    } finally {
      setDepositLoading(false);
    }
  };

  // Delete deposit
  const deleteDeposit = async (depositId) => {
    try {
      const token = getAuthToken();
      if (!token) {
        console.error('No auth token found');
        return;
      }

      const response = await fetch(`http://localhost:8080/api/deposits/${depositId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        await fetchDeposits(selectedJar.id);
        await fetchActivities(selectedJar.id);
        await fetchJars();
      } else {
        console.error(`Failed to delete deposit: ${response.status} ${response.statusText}`);
      }
    } catch (err) {
      console.error('Error deleting deposit:', err);
    }
  };

  useEffect(() => {
    fetchJars();
  }, []);

  useEffect(() => {
    if (selectedJar) {
      fetchDeposits(selectedJar.id);
      fetchActivities(selectedJar.id);
    }
  }, [selectedJar]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className={`w-12 h-12 border-4 border-t-blue-600 border-r-transparent rounded-full animate-spin mb-4 ${
            isDarkMode ? 'border-gray-700' : 'border-gray-200'
          }`}></div>
          <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Loading jars...</p>
        </div>
      </div>
    );
  }

  // Show error message if server is not reachable
  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center max-w-md px-4">
          <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
            isDarkMode ? 'bg-red-900 text-red-400' : 'bg-red-100 text-red-600'
          }`}>
            <PiggyBank className="w-8 h-8" />
          </div>
          <h3 className={`text-xl font-semibold mb-2 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Connection Error
          </h3>
          <p className={`text-sm mb-4 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {error}
          </p>
          <button
            onClick={() => {
              setLoading(true);
              fetchJars();
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Jar Details View
  if (selectedJar) {
    // Enhanced data extraction with multiple fallback options and proper formatting
    const currentAmount = selectedJar.currentAmount || selectedJar.current_amount || selectedJar.amount || 0;
    const goalAmount = selectedJar.goalAmount || selectedJar.goal_amount || selectedJar.targetAmount || selectedJar.target_amount || selectedJar.target || 0;
    const progress = goalAmount > 0 ? (currentAmount / goalAmount) * 100 : 0;
    const remainingAmount = Math.max(0, goalAmount - currentAmount);
    
    // Format numbers properly
    const formatCurrency = (amount) => {
      return new Intl.NumberFormat('en-IN', {
        maximumFractionDigits: 2,
        minimumFractionDigits: 0
      }).format(amount || 0);
    };

    console.log('Jar details:', {
      currentAmount,
      goalAmount,
      progress,
      remainingAmount,
      selectedJar
    });

    return (
      <div className="h-full flex flex-col">
        {/* Header with Jar Name prominently displayed */}
        <div className={`flex items-center justify-between p-6 border-b ${
          isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
        }`}>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSelectedJar(null)}
              className={`p-2 rounded-lg transition-colors ${
                isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              <ArrowLeft size={20} />
            </button>
            <div className="flex items-center space-x-3">
              <PiggyBank className="w-8 h-8 text-blue-600" />
              <div>
                <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {selectedJar.name}
                </h2>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Savings Jar
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Jar Stats - Enhanced with better visibility */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'} shadow-sm`}>
                <div className="flex items-center space-x-3">
                  <DollarSign className="w-8 h-8 text-green-500" />
                  <div>
                    <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Current Amount</p>
                    <p className={`text-2xl font-bold ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                      ₹{formatCurrency(currentAmount)}
                    </p>
                  </div>
                </div>
              </div>

              <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'} shadow-sm`}>
                <div className="flex items-center space-x-3">
                  <Target className="w-8 h-8 text-blue-500" />
                  <div>
                    <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Goal Amount</p>
                    <p className={`text-2xl font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                      ₹{formatCurrency(goalAmount)}
                    </p>
                  </div>
                </div>
              </div>

              <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'} shadow-sm`}>
                <div className="flex items-center space-x-3">
                  <Activity className="w-8 h-8 text-purple-500" />
                  <div>
                    <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Progress</p>
                    <p className={`text-2xl font-bold ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                      {progress.toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>

              <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'} shadow-sm`}>
                <div className="flex items-center space-x-3">
                  <Target className="w-8 h-8 text-orange-500" />
                  <div>
                    <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Remaining</p>
                    <p className={`text-2xl font-bold ${isDarkMode ? 'text-orange-400' : 'text-orange-600'}`}>
                      ₹{formatCurrency(remainingAmount)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Progress Bar */}
            <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'} shadow-sm`}>
              <div className="mb-6">
                <div className="flex justify-between items-center text-sm mb-3">
                  <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Progress to Goal</span>
                  <div className="flex items-center space-x-4">
                    <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      ₹{formatCurrency(currentAmount)} / ₹{formatCurrency(goalAmount)}
                    </span>
                    <span className={`font-bold ${progress >= 100 ? 'text-green-500' : 'text-blue-500'}`}>
                      {progress.toFixed(1)}%
                    </span>
                  </div>
                </div>
                <div className={`w-full h-4 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      progress >= 100 ? 'bg-green-500' : 'bg-blue-500'
                    }`}
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  ></div>
                </div>
                {progress >= 100 && (
                  <div className="mt-2 text-center">
                    <span className="text-green-500 font-semibold text-sm">🎉 Goal Achieved!</span>
                  </div>
                )}
              </div>
            </div>

            {/* Add Deposit */}
            <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'} shadow-sm`}>
              <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Add Deposit to "{selectedJar.name}"
              </h3>
              
              {/* Error Message */}
              {depositError && (
                <div className={`mb-4 p-3 rounded-lg flex items-start space-x-2 ${
                  isDarkMode ? 'bg-red-900/20 border border-red-800' : 'bg-red-50 border border-red-200'
                }`}>
                  <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <pre className={`text-sm whitespace-pre-wrap ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>
                      {depositError}
                    </pre>
                    {depositError.includes('log out and log in again') && (
                      <div className="mt-2">
                        <button
                          onClick={() => {
                            localStorage.clear();
                            window.location.reload();
                          }}
                          className="text-xs px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                        >
                          Clear Session & Reload
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              <div className="flex space-x-4">
                <input
                  type="number"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  placeholder="Enter amount"
                  className={`flex-1 px-4 py-2 rounded-lg border ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                <button
                  onClick={addDeposit}
                  disabled={!depositAmount || depositLoading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {depositLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Plus size={16} />
                  )}
                  <span>Add</span>
                </button>
              </div>
            </div>

            {/* Recent Deposits */}
            <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'} shadow-sm`}>
              <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Recent Deposits - "{selectedJar.name}"
              </h3>
              {deposits.length === 0 ? (
                <p className={`text-center py-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  No deposits yet for this jar
                </p>
              ) : (
                <div className="space-y-3">
                  {deposits.slice(0, 5).map((deposit) => (
                    <div key={deposit.id} className={`flex items-center justify-between p-4 rounded-lg ${
                      isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                    }`}>
                      <div className="flex items-center space-x-3">
                        <Calendar size={16} className={isDarkMode ? 'text-gray-400' : 'text-gray-600'} />
                        <div>
                          <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            ₹{formatCurrency(deposit.amount)}
                          </p>
                          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {new Date(deposit.depositeDate || deposit.depositDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => deleteDeposit(deposit.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          isDarkMode 
                            ? 'hover:bg-gray-600 text-gray-400 hover:text-red-400' 
                            : 'hover:bg-gray-200 text-gray-600 hover:text-red-600'
                        }`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Jars List View - Enhanced with better visibility
  return (
    <div className="h-full flex flex-col">
      <div className="p-6">
        <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          My Savings Jars
        </h2>

        {jars.length === 0 ? (
          <div className="text-center py-12">
            <PiggyBank className={`w-16 h-16 mx-auto mb-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
            <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              No Jars Found
            </h3>
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Create your first jar to start saving!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jars.map((jar) => {
              // Enhanced data extraction with multiple fallback options
              const currentAmount = jar.currentAmount || jar.current_amount || jar.amount || 0;
              const goalAmount = jar.goalAmount || jar.goal_amount || jar.targetAmount || jar.target_amount || jar.target || 0;
              const progress = goalAmount > 0 ? (currentAmount / goalAmount) * 100 : 0;
              
              const formatCurrency = (amount) => {
                return new Intl.NumberFormat('en-IN', {
                  maximumFractionDigits: 2,
                  minimumFractionDigits: 0
                }).format(amount || 0);
              };
              
              return (
                <div
                  key={jar.id}
                  onClick={() => setSelectedJar(jar)}
                  className={`p-6 rounded-xl cursor-pointer transition-all duration-200 hover:scale-105 ${
                    isDarkMode ? 'bg-gray-800 hover:bg-gray-750 border border-gray-700' : 'bg-white hover:shadow-lg border border-gray-200'
                  } shadow-sm`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <PiggyBank className="w-6 h-6 text-blue-600" />
                      <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {jar.name}
                      </h3>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      progress >= 100 
                        ? 'bg-green-100 text-green-800' 
                        : progress >= 50 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {progress.toFixed(0)}%
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Progress</span>
                        <span className={`font-bold ${progress >= 100 ? 'text-green-500' : 'text-blue-500'}`}>
                          {progress.toFixed(1)}%
                        </span>
                      </div>
                      <div className={`w-full h-3 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                        <div 
                          className={`h-full rounded-full transition-all duration-300 ${
                            progress >= 100 ? 'bg-green-500' : 'bg-blue-500'
                          }`}
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between">
                      <div>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Current</p>
                        <p className={`font-semibold text-lg ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                          ₹{formatCurrency(currentAmount)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Goal</p>
                        <p className={`font-semibold text-lg ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                          ₹{formatCurrency(goalAmount)}
                        </p>
                      </div>
                    </div>
                    
                    {goalAmount > 0 && (
                      <div className="text-center pt-2 border-t border-gray-200 dark:border-gray-700">
                        <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                          {progress >= 100 ? (
                            <span className="text-green-500 font-medium">🎉 Goal Achieved!</span>
                          ) : (
                            `₹{formatCurrency(goalAmount - currentAmount)} remaining`
                          )}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewJars;