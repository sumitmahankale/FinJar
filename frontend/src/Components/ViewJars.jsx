import React, { useState, useEffect, useRef } from 'react';

import { 
  PiggyBank, 
  Plus, 
  Trash2, 
  ArrowLeft,
  Calendar,
  DollarSign,
  Target,
  Activity,
  AlertCircle,
  RefreshCw,
  MoreVertical,
  Edit3,
  AlertTriangle
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
  const [refreshing, setRefreshing] = useState(false);
  
  // New state for jar deletion
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [jarToDelete, setJarToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [deleteConfirmInput, setDeleteConfirmInput] = useState('');

  const hasFetchedJars = useRef(false);

  // Get auth token from localStorage
  const getAuthToken = () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setError('No authentication token found. Please log in again.');
      return null;
    }
    return token;
  };

  // Delete jar function
  // ...existing code...

// Delete jar function with deposits cleanup
// ...existing code...

// Delete jar function with improved error handling
const deleteJar = async (jarId) => {
  setDeleteLoading(true);
  setDeleteError('');

  try {
    const token = getAuthToken();
    if (!token) {
      setDeleteError('Authentication required. Please log in again.');
      return;
    }

    console.log('Deleting jar:', jarId);

    // Step 1: First fetch and delete all deposits for this jar
    try {
      console.log('Fetching deposits to delete for jar:', jarId);
      const depositsResponse = await fetch(`http://localhost:8080/api/deposits/jar/${jarId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (depositsResponse.ok) {
        let depositsText = await depositsResponse.text();
        
        if (depositsText && depositsText.trim() !== '') {
          try {
            // Handle potential circular reference issues in deposits response
            let depositsToDelete = [];
            
            // Try normal JSON parsing first
            try {
              const depositsData = JSON.parse(depositsText);
              if (Array.isArray(depositsData)) {
                depositsToDelete = depositsData;
              }
            } catch {
              // If JSON parsing fails, try manual extraction
              console.warn('JSON parsing failed, extracting deposit IDs manually');
              const depositIdPattern = /"id"\s*:\s*(\d+)/g;
              let match;
              const extractedIds = [];
              
              while ((match = depositIdPattern.exec(depositsText)) !== null) {
                const depositId = parseInt(match[1]);
                if (!extractedIds.includes(depositId)) {
                  extractedIds.push(depositId);
                  depositsToDelete.push({ id: depositId });
                }
              }
            }
            
            if (depositsToDelete.length > 0) {
              console.log(`Found ${depositsToDelete.length} deposits to delete first`);
              
              // Delete each deposit
              for (const deposit of depositsToDelete) {
                try {
                  console.log(`Deleting deposit ${deposit.id}`);
                  const deleteDepositResponse = await fetch(`http://localhost:8080/api/deposits/${deposit.id}`, {
                    method: 'DELETE',
                    headers: {
                      'Authorization': `Bearer ${token}`,
                      'Content-Type': 'application/json'
                    }
                  });
                  
                  if (deleteDepositResponse.ok) {
                    console.log(`Successfully deleted deposit ${deposit.id}`);
                  } else {
                    console.warn(`Failed to delete deposit ${deposit.id}:`, deleteDepositResponse.status);
                  }
                } catch (depositError) {
                  console.warn(`Error deleting deposit ${deposit.id}:`, depositError);
                }
              }
              
              console.log('All deposits cleanup completed, now deleting jar');
              
              // Add a small delay to ensure database transactions are committed
              await new Promise(resolve => setTimeout(resolve, 500));
            } else {
              console.log('No deposits found for this jar');
            }
          } catch (parseError) {
            console.warn('Could not parse deposits, proceeding with jar deletion:', parseError);
          }
        } else {
          console.log('Empty deposits response, no deposits to delete');
        }
      } else {
        console.warn('Failed to fetch deposits for cleanup:', depositsResponse.status);
        // Continue with jar deletion anyway
      }
    } catch (depositsError) {
      console.warn('Error during deposits cleanup:', depositsError);
      // Continue with jar deletion anyway
    }

    // Step 2: Now delete the jar
    console.log('Now attempting to delete the jar...');
    const response = await fetch(`http://localhost:8080/api/jars/${jarId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('Delete jar response status:', response.status);

    if (response.ok) {
      console.log('Jar deleted successfully');
      
      // Remove jar from local state
      setJars(prev => prev.filter(jar => jar.id !== jarId));
      
      // If we're viewing the deleted jar, go back to list
      if (selectedJar && selectedJar.id === jarId) {
        setSelectedJar(null);
      }
      
      // Close modal
      setShowDeleteModal(false);
      setJarToDelete(null);
      setDeleteConfirmInput('');
      
    } else {
      // Read the error response only once
      let errorText = '';
      try {
        errorText = await response.text();
      } catch (textError) {
        console.warn('Could not read error response:', textError);
        errorText = 'Unknown error';
      }
      
      console.error('Failed to delete jar:', response.status, errorText);
      
      if (response.status === 401) {
        setDeleteError('Session expired. Please log out and log in again.');
        localStorage.removeItem('authToken');
      } else if (response.status === 403) {
        setDeleteError('You do not have permission to delete this jar.');
      } else if (response.status === 404) {
        setDeleteError('Jar not found. It may have already been deleted.');
        // Remove from local state anyway
        setJars(prev => prev.filter(jar => jar.id !== jarId));
        setShowDeleteModal(false);
        setJarToDelete(null);
        setDeleteConfirmInput('');
      } else if (response.status === 500) {
        if (errorText.includes('ConstraintViolationException') || errorText.includes('DataIntegrityViolationException')) {
          setDeleteError('Database constraint error: There may be hidden references to this jar. This requires backend database cleanup. Please contact your system administrator.');
        } else {
          setDeleteError('Backend server error. Please try again or contact support.');
        }
      } else {
        setDeleteError(`Failed to delete jar: ${errorText || 'Unknown error'}`);
      }
    }
  } catch (err) {
    console.error('Network error deleting jar:', err);
    setDeleteError('Network error. Please check your connection and try again.');
  } finally {
    setDeleteLoading(false);
  }
};

// ...existing code...

// ...existing code...

  // Handle delete jar button click
  const handleDeleteJarClick = (jar, event) => {
    event.stopPropagation(); // Prevent jar selection
    setJarToDelete(jar);
    setShowDeleteModal(true);
    setDeleteError('');
    setDeleteConfirmInput('');
  };

  // Confirm jar deletion
  const confirmDeleteJar = () => {
    if (jarToDelete && deleteConfirmInput.toUpperCase() === 'DELETE') {
      deleteJar(jarToDelete.id);
    }
  };

  // Cancel jar deletion
  const cancelDeleteJar = () => {
    setShowDeleteModal(false);
    setJarToDelete(null);
    setDeleteError('');
    setDeleteConfirmInput('');
  };

  // Fetch user's jars
  const fetchJars = async (showRefreshing = false) => {
    try {
      if (showRefreshing) setRefreshing(true);
      setError(null);
      
      const token = getAuthToken();
      if (!token) return;

      console.log('Fetching jars...');

      const response = await fetch('http://localhost:8080/api/jars', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Response status:', response.status);

      if (response.ok) {
        // Get response as text first to handle Jackson circular reference issues
        let responseText = await response.text();
        console.log('Response length:', responseText.length);
        
        // Check if response is empty
        if (!responseText || responseText.trim() === '') {
          console.log('Empty response received');
          setJars([]);
          return;
        }

        // If the response is too large (indicating circular reference), extract data manually
        if (responseText.length > 50000) {
          console.warn('Response too large, extracting jar data manually...');
          
          try {
            // Extract jar data using multiple regex patterns to be more flexible
            const extractedJars = [];
            
            // Pattern 1: Look for jar objects with id, title, targetAmount, savedAmount
            const jarPattern1 = /"id"\s*:\s*(\d+)[^}]*?"title"\s*:\s*"([^"]*)"[^}]*?"targetAmount"\s*:\s*([\d.]+)[^}]*?"savedAmount"\s*:\s*([\d.]+)/g;
            let match;
            
            while ((match = jarPattern1.exec(responseText)) !== null) {
              const jarId = parseInt(match[1]);
              // Check if we already have this jar
              if (!extractedJars.find(jar => jar.id === jarId)) {
                extractedJars.push({
                  id: jarId,
                  title: match[2],
                  targetAmount: parseFloat(match[3]) || 0,
                  savedAmount: parseFloat(match[4]) || 0
                });
              }
            }
            
            // Pattern 2: Alternative field names (goal_amount, current_amount, etc.)
            if (extractedJars.length === 0) {
              const jarPattern2 = /"id"\s*:\s*(\d+)[^}]*?"(?:title|name|jarName)"\s*:\s*"([^"]*)"[^}]*?"(?:targetAmount|goalAmount|target_amount|goal_amount)"\s*:\s*([\d.]+)[^}]*?"(?:savedAmount|currentAmount|saved_amount|current_amount)"\s*:\s*([\d.]+)/g;
              
              while ((match = jarPattern2.exec(responseText)) !== null) {
                const jarId = parseInt(match[1]);
                if (!extractedJars.find(jar => jar.id === jarId)) {
                  extractedJars.push({
                    id: jarId,
                    title: match[2],
                    targetAmount: parseFloat(match[3]) || 0,
                    savedAmount: parseFloat(match[4]) || 0
                  });
                }
              }
            }
            
            // Pattern 3: Just extract basic jar info if other patterns fail
            if (extractedJars.length === 0) {
              const basicPattern = /"id"\s*:\s*(\d+)[^}]*?"(?:title|name)"\s*:\s*"([^"]*)"/g;
              
              while ((match = basicPattern.exec(responseText)) !== null) {
                const jarId = parseInt(match[1]);
                if (!extractedJars.find(jar => jar.id === jarId)) {
                  extractedJars.push({
                    id: jarId,
                    title: match[2],
                    targetAmount: 0,
                    savedAmount: 0
                  });
                }
              }
            }
            
            if (extractedJars.length > 0) {
              console.log('Successfully extracted jars manually:', extractedJars);
              setJars(extractedJars);
              return;
            } else {
              setError('Could not extract jar data from response. Your backend has a circular reference issue that needs to be fixed.');
              return;
            }
            
          } catch (extractionError) {
            console.error('Manual extraction failed:', extractionError);
            setError('Backend returned circular reference data. Manual extraction also failed. Please restart your backend server.');
            return;
          }
        }

        // For normal sized responses, try regular JSON parsing
        try {
          // Clean up common JSON issues
          responseText = responseText.replace(/,(\s*[}\]])/g, '$1');
          
          // Try to parse the JSON
          const data = JSON.parse(responseText);
          console.log('Successfully parsed jars:', data);
          
          // Ensure it's an array and clean the data
          if (Array.isArray(data)) {
            // Clean each jar object to remove potential circular references
            const cleanedJars = data.map(jar => ({
              id: jar.id,
              title: jar.title || jar.name || jar.jarName || 'Unnamed Jar',
              targetAmount: jar.targetAmount || jar.target_amount || jar.goalAmount || 0,
              savedAmount: jar.savedAmount || jar.saved_amount || jar.currentAmount || 0,
              // Don't include nested objects that might cause issues
            }));
            
            setJars(cleanedJars);
          } else {
            setJars([]);
          }
          
        } catch (jsonError) {
          console.error('JSON parsing error:', jsonError);
          setError('Failed to parse jar data. This appears to be a circular reference issue in your backend.');
        }
      } else if (response.status === 401) {
        setError('Session expired. Please log in again.');
        localStorage.removeItem('authToken');
      } else if (response.status === 500) {
        setError('Backend server error. This is likely a Jackson circular reference issue. Please check your backend logs.');
      } else {
        const errorText = await response.text();
        console.error('HTTP error response:', errorText);
        setError(`Failed to fetch jars: ${response.status} - ${errorText}`);
      }
    } catch (err) {
      console.error('Network error fetching jars:', err);
      setError('Unable to connect to server. Please check if the backend is running on localhost:8080');
    } finally {
      setLoading(false);
      if (showRefreshing) setRefreshing(false);
    }
  };

  // Fetch deposits for a specific jar
  const fetchDeposits = async (jarId) => {
    console.log('Fetching deposits for jar:', jarId);
    
    try {
      const token = getAuthToken();
      if (!token) return;

      const response = await fetch(`http://localhost:8080/api/deposits/jar/${jarId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Deposits response status:', response.status);

      if (response.ok) {
        // Handle deposits response similar to jars
        let responseText = await response.text();
        console.log('Deposits response length:', responseText.length);
        
        if (!responseText || responseText.trim() === '') {
          console.log('Empty deposits response');
          setDeposits([]);
          return;
        }

        // If response is too large (circular reference), extract manually
        if (responseText.length > 50000) {
          console.warn('Deposits response too large, extracting manually...');
          
          try {
            const extractedDeposits = [];
            // Pattern for deposits: id, amount, date
            const depositPattern = /"id"\s*:\s*(\d+)[^}]*?"amount"\s*:\s*([\d.]+)[^}]*?"(?:date|timestamp|createdAt)"\s*:\s*"([^"]*)"/g;
            let match;
            
            while ((match = depositPattern.exec(responseText)) !== null) {
              const depositId = parseInt(match[1]);
              if (!extractedDeposits.find(dep => dep.id === depositId)) {
                extractedDeposits.push({
                  id: depositId,
                  amount: parseFloat(match[2]) || 0,
                  date: match[3]
                });
              }
            }
            
            console.log('Extracted deposits manually:', extractedDeposits);
            setDeposits(extractedDeposits);
            return;
          } catch (extractionError) {
            console.error('Failed to extract deposits:', extractionError);
            setDeposits([]);
            return;
          }
        }

        // Normal JSON parsing for smaller responses
        try {
          responseText = responseText.replace(/,(\s*[}\]])/g, '$1');
          
          const data = JSON.parse(responseText);
          console.log('Fetched deposits successfully:', data);
          
          if (Array.isArray(data)) {
            setDeposits(data);
          } else {
            console.log('Deposits data is not an array:', data);
            setDeposits([]);
          }
        } catch (jsonError) {
          console.error('Error parsing deposits JSON:', jsonError);
          setDeposits([]);
        }
      } else {
        console.error('Failed to fetch deposits:', response.status);
        setDeposits([]);
      }
    } catch (err) {
      console.error('Error fetching deposits:', err);
      setDeposits([]);
    }
  };

  useEffect(() => {
    if (!hasFetchedJars.current) {
      hasFetchedJars.current = true;
      fetchJars();
    }
  }, []);

  useEffect(() => {
    if (selectedJar && selectedJar.id) {
      console.log('Selected jar changed, fetching deposits for jar:', selectedJar.id);
      fetchDeposits(selectedJar.id);
    }
  }, [selectedJar?.id]);

  // Add deposit to jar
  const addDeposit = async () => {
    setDepositError('');
    
    if (!depositAmount || !selectedJar) {
      setDepositError('Please enter a deposit amount.');
      return;
    }

    const amount = parseFloat(depositAmount);
    if (isNaN(amount) || amount <= 0) {
      setDepositError('Please enter a valid amount greater than 0.');
      return;
    }

    const token = getAuthToken();
    if (!token) {
      setDepositError('Authentication required. Please log in again.');
      return;
    }
    
    setDepositLoading(true);

    try {
      const depositData = {
        amount: amount,
        date: new Date().toISOString()
      };
      
      console.log('Adding deposit:', depositData);
      
      const response = await fetch(`http://localhost:8080/api/deposits/jar/${selectedJar.id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(depositData)
      });

      if (response.ok) {
        // Handle the response which might also have circular reference issues
        let responseText = await response.text();
        
        try {
          // Try to parse response, but don't fail if it has issues
          if (responseText && responseText.trim() !== '') {
            const result = JSON.parse(responseText);
            console.log('Deposit added successfully:', result);
          } else {
            console.log('Deposit added successfully (empty response)');
          }
        } catch (parseError) {
          console.log('Deposit added successfully (response parsing failed, but HTTP 200):', parseError.message);
        }
        
        // Clear form
        setDepositAmount('');
        setDepositError('');
        
        // Refresh deposits
        await fetchDeposits(selectedJar.id);
        
        // Update selected jar locally
        setSelectedJar(prev => ({
          ...prev,
          savedAmount: prev.savedAmount + amount
        }));
        
        // Update the jar in the main jars list
        setJars(prev => prev.map(jar => 
          jar.id === selectedJar.id 
            ? { ...jar, savedAmount: jar.savedAmount + amount }
            : jar
        ));
      } else {
        const errorText = await response.text();
        console.error('Failed to add deposit:', response.status, errorText);
        
        if (response.status === 401) {
          setDepositError('Session expired. Please log out and log in again.');
          localStorage.removeItem('authToken');
        } else if (response.status === 403) {
          setDepositError('You do not have permission to add deposits to this jar.');
        } else if (response.status === 404) {
          setDepositError('Jar not found. Please refresh the page and try again.');
        } else {
          setDepositError(`Failed to add deposit: ${errorText || 'Unknown error'}`);
        }
      }
    } catch (err) {
      console.error('Network error adding deposit:', err);
      // Check if it's a JSON parsing error from a successful response
      if (err.message.includes('JSON') && err.message.includes('position')) {
        console.log('Deposit likely added successfully, but response has JSON issues');
        setDepositAmount('');
        setDepositError('');
        await fetchDeposits(selectedJar.id);
      } else {
        setDepositError('Network error. Please check your connection and try again.');
      }
    } finally {
      setDepositLoading(false);
    }
  };

  // Delete deposit
  const deleteDeposit = async (depositId) => {
    try {
      const token = getAuthToken();
      if (!token) return;

      const response = await fetch(`http://localhost:8080/api/deposits/${depositId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        console.log('Deposit deleted successfully');
        
        // Find the deleted deposit to get its amount
        const deletedDeposit = deposits.find(d => d.id === depositId);
        if (deletedDeposit) {
          const deletedAmount = deletedDeposit.amount;
          
          // Update selected jar
          setSelectedJar(prev => ({
            ...prev,
            savedAmount: prev.savedAmount - deletedAmount
          }));
          
          // Update jars list
          setJars(prev => prev.map(jar => 
            jar.id === selectedJar.id 
              ? { ...jar, savedAmount: jar.savedAmount - deletedAmount }
              : jar
          ));
        }
        
        // Refresh deposits list
        await fetchDeposits(selectedJar.id);
      } else {
        console.error('Failed to delete deposit:', response.status);
      }
    } catch (err) {
      console.error('Error deleting deposit:', err);
    }
  };

  // Utility function to get the correct field values from jar object
  const getJarValues = (jar) => {
    // Try different possible field names based on your backend response
    const currentAmount = jar.savedAmount || jar.saved_amount || jar.currentAmount || jar.current_amount || 0;
    const goalAmount = jar.targetAmount || jar.target_amount || jar.goalAmount || jar.goal_amount || 0;
    const jarName = jar.title || jar.name || jar.jarName || jar.jar_name || 'Unnamed Jar';
    
    return { currentAmount, goalAmount, jarName };
  };

  // Format currency for Indian locale
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 2,
      minimumFractionDigits: 0
    }).format(amount || 0);
  };

  // Delete Confirmation Modal Component
  const DeleteJarModal = () => {
    if (!showDeleteModal || !jarToDelete) return null;

    const { currentAmount, goalAmount, jarName } = getJarValues(jarToDelete);
    const canDelete = deleteConfirmInput.toUpperCase() === 'DELETE';

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/50"
          onClick={!deleteLoading ? cancelDeleteJar : undefined}
        />
        
        {/* Modal */}
        <div className={`relative w-full max-w-md mx-auto rounded-2xl shadow-2xl ${
          isDarkMode 
            ? 'bg-gray-800 border border-gray-700' 
            : 'bg-white border border-gray-200'
        }`}>
          {/* Header */}
          <div className="p-6 pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-full bg-red-100">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className={`text-lg font-semibold ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    Delete Jar
                  </h3>
                  <p className={`text-sm ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    This action cannot be undone
                  </p>
                </div>
              </div>
              {!deleteLoading && (
                <button
                  onClick={cancelDeleteJar}
                  className={`p-1 rounded-full transition-colors ${
                    isDarkMode 
                      ? 'text-gray-400 hover:text-white hover:bg-gray-700' 
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="text-lg">✕</span>
                </button>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="px-6 pb-4">
            {/* Jar Info */}
            <div className={`p-4 rounded-lg mb-4 ${
              isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
            }`}>
              <div className="flex items-center space-x-3">
                <PiggyBank className="w-8 h-8 text-blue-600" />
                <div>
                  <p className={`font-semibold ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {jarName}
                  </p>
                  <p className={`text-sm ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    ₹{formatCurrency(currentAmount)} of ₹{formatCurrency(goalAmount)}
                  </p>
                </div>
              </div>
            </div>

            {/* Warning Message */}
            <div className={`p-3 rounded-lg mb-4 ${
              isDarkMode ? 'bg-red-900/20 border border-red-800' : 'bg-red-50 border border-red-200'
            }`}>
              <p className={`text-sm ${
                isDarkMode ? 'text-red-400' : 'text-red-600'
              }`}>
                <strong>Warning:</strong> Deleting this jar will permanently remove:
              </p>
              <ul className={`text-sm mt-2 space-y-1 ${
                isDarkMode ? 'text-red-400' : 'text-red-600'
              }`}>
                <li>• The jar and its ₹{formatCurrency(currentAmount)} savings</li>
                <li>• All deposit history ({deposits.length} deposits)</li>
                <li>• This action cannot be undone</li>
              </ul>
            </div>

            {/* Error Message */}
            {deleteError && (
              <div className={`p-3 rounded-lg mb-4 flex items-start space-x-2 ${
                isDarkMode ? 'bg-red-900/20 border border-red-800' : 'bg-red-50 border border-red-200'
              }`}>
                <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                <p className={`text-sm ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>
                  {deleteError}
                </p>
              </div>
            )}

            {/* Confirmation Input */}
            <div className="mb-6">
              <p className={`text-sm mb-2 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Type <strong>DELETE</strong> to confirm:
              </p>
              <input
                type="text"
                value={deleteConfirmInput}
                onChange={(e) => setDeleteConfirmInput(e.target.value)}
                placeholder="Type DELETE"
                disabled={deleteLoading}
                className={`w-full px-3 py-2 rounded-lg border ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50`}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-3 p-6 pt-0">
            <button
              onClick={cancelDeleteJar}
              disabled={deleteLoading}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                isDarkMode 
                  ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              } disabled:opacity-50`}
            >
              Cancel
            </button>
            <button
              onClick={confirmDeleteJar}
              disabled={deleteLoading || !canDelete}
              className="flex-1 py-3 px-4 rounded-lg font-medium bg-red-600 hover:bg-red-700 text-white disabled:opacity-50 flex items-center justify-center space-x-2 transition-colors"
            >
              {deleteLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Deleting...</span>
                </>
              ) : (
                <>
                  <Trash2 size={16} />
                  <span>Delete Jar</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };

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

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center max-w-2xl px-4">
          <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
            isDarkMode ? 'bg-red-900 text-red-400' : 'bg-red-100 text-red-600'
          }`}>
            <AlertCircle className="w-8 h-8" />
          </div>
          <h3 className={`text-xl font-semibold mb-2 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Connection Error
          </h3>
          <div className={`text-sm mb-4 p-4 rounded-lg ${
            isDarkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'
          }`}>
            <p className="font-medium mb-2">Error Details:</p>
            <p className="text-left">{error}</p>
          </div>
          <div className="space-y-2">
            <button
              onClick={() => {
                setLoading(true);
                fetchJars();
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mr-2"
            >
              Try Again
            </button>
            <button
              onClick={() => {
                localStorage.removeItem('authToken');
                window.location.reload();
              }}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Clear Session & Reload
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Jar Details View
  if (selectedJar) {
    const { currentAmount, goalAmount, jarName } = getJarValues(selectedJar);
    const progress = goalAmount > 0 ? (currentAmount / goalAmount) * 100 : 0;
    const remainingAmount = Math.max(0, goalAmount - currentAmount);

    return (
      <div className="h-full flex flex-col">
        {/* Delete Modal */}
        <DeleteJarModal />

        {/* Header */}
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
                  {jarName}
                </h2>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Savings Jar
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => fetchJars(true)}
              disabled={refreshing}
              className={`p-2 rounded-lg transition-colors ${
                isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'
              } ${refreshing ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <RefreshCw size={20} className={refreshing ? 'animate-spin' : ''} />
            </button>
            <button
              onClick={(e) => handleDeleteJarClick(selectedJar, e)}
              className={`p-2 rounded-lg transition-colors ${
                isDarkMode 
                  ? 'hover:bg-red-900 text-gray-400 hover:text-red-400' 
                  : 'hover:bg-red-100 text-gray-600 hover:text-red-600'
              }`}
              title="Delete jar"
            >
              <Trash2 size={20} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Jar Stats */}
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

            {/* Progress Bar */}
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
                Add Deposit to "{jarName}"
              </h3>
              
              {depositError && (
                <div className={`mb-4 p-3 rounded-lg flex items-start space-x-2 ${
                  isDarkMode ? 'bg-red-900/20 border border-red-800' : 'bg-red-50 border border-red-200'
                }`}>
                  <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className={`text-sm ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>
                      {depositError}
                    </p>
                  </div>
                </div>
              )}
              
              <div className="flex space-x-4">
                <input
                  type="number"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  placeholder="Enter amount (₹)"
                  step="0.01"
                  min="0"
                  className={`flex-1 px-4 py-2 rounded-lg border ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                <button
                  onClick={addDeposit}
                  disabled={!depositAmount || depositLoading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 transition-colors"
                >
                  {depositLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Plus size={16} />
                  )}
                  <span>{depositLoading ? 'Adding...' : 'Add Deposit'}</span>
                </button>
              </div>
            </div>

            {/* Recent Deposits */}
            <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'} shadow-sm`}>
              <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Recent Deposits
              </h3>
              {deposits.length === 0 ? (
                <p className={`text-center py-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  No deposits yet for this jar
                </p>
              ) : (
                <div className="space-y-3">
                  {deposits
                    .sort((a, b) => new Date(b.date || b.timestamp) - new Date(a.date || a.timestamp))
                    .slice(0, 10)
                    .map((deposit) => (
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
                            {new Date(deposit.date || deposit.timestamp).toLocaleDateString('en-IN')}
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
                        title="Delete deposit"
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

  // Jars List View
  return (
    <div className="h-full flex flex-col">
      {/* Delete Modal */}
      <DeleteJarModal />

      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            My Savings Jars
          </h2>
          <button
            onClick={() => fetchJars(true)}
            disabled={refreshing}
            className={`p-2 rounded-lg transition-colors ${
              isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'
            } ${refreshing ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <RefreshCw size={20} className={refreshing ? 'animate-spin' : ''} />
          </button>
        </div>

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
              const { currentAmount, goalAmount, jarName } = getJarValues(jar);
              const progress = goalAmount > 0 ? (currentAmount / goalAmount) * 100 : 0;
              
              return (
                // ...existing code...

<div
  key={jar.id}
  className={`p-6 rounded-xl cursor-pointer transition-all duration-200 hover:scale-105 relative group ${
    isDarkMode ? 'bg-gray-800 hover:bg-gray-750 border border-gray-700' : 'bg-white hover:shadow-lg border border-gray-200'
  } shadow-sm`}
  onClick={() => setSelectedJar(jar)}
>
  {/* Delete Button - Shows on hover in empty space at bottom right */}
  <button
    onClick={(e) => handleDeleteJarClick(jar, e)}
    className={`absolute bottom-3 right-3 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 z-10 ${
      isDarkMode 
        ? 'bg-gray-700 hover:bg-red-600 text-gray-400 hover:text-white' 
        : 'bg-gray-100 hover:bg-red-500 text-gray-600 hover:text-white'
    }`}
    title="Delete jar"
  >
    <Trash2 size={16} />
  </button>

  <div className="flex items-center justify-between mb-4">
    <div className="flex items-center space-x-3">
      <PiggyBank className="w-6 h-6 text-blue-600" />
      <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        {jarName}
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
  
  {/* Rest of the jar content - add padding bottom to make space for delete button */}
  <div className="space-y-4 pb-10">
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
            `₹${formatCurrency(goalAmount - currentAmount)} remaining`
          )}
        </p>
      </div>
    )}
  </div>
</div>

// ...existing code...
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewJars;