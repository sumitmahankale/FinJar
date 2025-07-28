import React, { useState, useEffect, useRef } from 'react';
import { 
  Settings as SettingsIcon, 
  User, 
  Shield, 
  Bell,
  Moon,
  Sun,
  Database,
  Download,
  Trash2,
  Eye,
  EyeOff,
  Save,
  AlertCircle,
  Check,
  RefreshCw,
  Lock,
  Mail,
  Calendar,
  Globe,
  Smartphone
} from 'lucide-react';

const Settings = ({ isDarkMode = false }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('profile'); // profile, security, notifications, preferences, data
  const [showSuccess, setShowSuccess] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [settings, setSettings] = useState({
    // Profile settings
    email: '',
    name: '',
    phone: '',
    timezone: 'Asia/Kolkata',
    language: 'en',
    
    // Security settings
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorEnabled: false,
    
    // Notification settings
    emailNotifications: true,
    pushNotifications: true,
    weeklyReports: true,
    goalAchievements: true,
    depositReminders: true,
    
    // Preference settings
    currency: 'INR',
    dateFormat: 'DD/MM/YYYY',
    darkMode: isDarkMode,
    autoSave: true,
    showProgress: true,
    
    // Privacy settings
    profilePublic: false,
    shareAnalytics: false
  });
  
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  
  const hasFetchedData = useRef(false);

  // Get auth token from localStorage
  const getAuthToken = () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setError('No authentication token found. Please log in again.');
      return null;
    }
    return token;
  };

  // Parse JWT to get user info
  const parseJwtPayload = (token) => {
    try {
      const payload = token.split('.')[1];
      const decodedPayload = JSON.parse(atob(payload));
      return decodedPayload;
    } catch (error) {
      console.error('Error parsing JWT:', error);
      return null;
    }
  };

  // Fetch user profile
  const fetchUserProfile = async () => {
    try {
      setError(null);
      
      const token = getAuthToken();
      if (!token) return;

      // Parse user info from JWT
      const userInfo = parseJwtPayload(token);
      if (userInfo) {
        const userData = {
          email: userInfo.sub || userInfo.email || '',
          name: userInfo.name || userInfo.sub?.split('@')[0] || 'User',
          id: userInfo.userId || userInfo.id,
          joinDate: userInfo.iat ? new Date(userInfo.iat * 1000) : new Date()
        };
        
        setUserProfile(userData);
        setSettings(prev => ({
          ...prev,
          email: userData.email,
          name: userData.name
        }));
      }

    } catch (err) {
      console.error('Error fetching user profile:', err);
      setError('Unable to load user profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Save settings
  const saveSettings = async (settingsToSave = null) => {
    setSaving(true);
    try {
      const token = getAuthToken();
      if (!token) return;

      // Simulate API call - replace with actual endpoint
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Save to localStorage for demo
      const settingsData = settingsToSave || settings;
      localStorage.setItem('userSettings', JSON.stringify(settingsData));
      
      // Update dark mode if changed
      if (settingsData.darkMode !== isDarkMode) {
        localStorage.setItem('isDarkMode', settingsData.darkMode.toString());
        window.location.reload(); // Reload to apply dark mode change
      }
      
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      
    } catch (err) {
      console.error('Error saving settings:', err);
      setError('Failed to save settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Load saved settings from localStorage
  const loadSavedSettings = () => {
    try {
      const savedSettings = localStorage.getItem('userSettings');
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        setSettings(prev => ({ ...prev, ...parsed }));
      }
    } catch (err) {
      console.warn('Failed to load saved settings:', err);
    }
  };

  // Handle input changes
  const handleInputChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle password visibility toggle
  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  // Validate password change
  const validatePasswordChange = () => {
    if (!settings.currentPassword) return 'Current password is required';
    if (!settings.newPassword) return 'New password is required';
    if (settings.newPassword.length < 6) return 'New password must be at least 6 characters';
    if (settings.newPassword !== settings.confirmPassword) return 'Passwords do not match';
    return null;
  };

  // Handle password change
  // ...existing code...

// Handle password change
const handlePasswordChange = async () => {
  const validation = validatePasswordChange();
  if (validation) {
    setError(validation);
    return;
  }

  setSaving(true);
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Clear password fields
    setSettings(prev => ({
      ...prev,
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }));
    
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
    
  } catch (error) {
    console.error('Password change error:', error);
    setError('Failed to change password. Please try again.');
  } finally {
    setSaving(false);
  }
};

// ...existing code...

  // Export user data
  const exportUserData = () => {
    const data = {
      profile: userProfile,
      settings: settings,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `finjar-user-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  // Delete account (placeholder)
  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      alert('Account deletion would be implemented here');
    }
  };

  useEffect(() => {
    if (!hasFetchedData.current) {
      hasFetchedData.current = true;
      loadSavedSettings();
      fetchUserProfile();
    }
  }, []);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className={`w-12 h-12 border-4 border-t-blue-600 border-r-transparent rounded-full animate-spin mb-4 ${
            isDarkMode ? 'border-gray-700' : 'border-gray-200'
          }`}></div>
          <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Loading settings...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'preferences', label: 'Preferences', icon: SettingsIcon },
    { id: 'data', label: 'Data & Privacy', icon: Database }
  ];

  return (
    <div className="h-full flex flex-col">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Settings
            </h2>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Manage your account preferences and security
            </p>
          </div>
          
          {/* Success Message */}
          {showSuccess && (
            <div className="flex items-center space-x-2 bg-green-100 text-green-800 px-4 py-2 rounded-lg">
              <Check size={16} />
              <span className="text-sm font-medium">Settings saved successfully!</span>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className={`p-4 rounded-lg mb-6 ${
            isDarkMode ? 'bg-red-900 text-red-200 border border-red-800' : 'bg-red-100 text-red-800 border border-red-200'
          }`}>
            <div className="flex items-center space-x-2">
              <AlertCircle size={16} />
              <span className="text-sm font-medium">{error}</span>
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Tabs */}
          <div className={`lg:w-64 ${
            isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
          } rounded-lg p-4`}>
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-600 text-white'
                        : isDarkMode
                        ? 'text-gray-300 hover:bg-gray-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon size={18} />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Content Area */}
          <div className="flex-1">
            <div className={`${
              isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
            } rounded-lg p-6`}>
              
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <div>
                    <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Profile Information
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Email Address
                        </label>
                        <div className="relative">
                          <Mail className={`absolute left-3 top-3 w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                          <input
                            type="email"
                            value={settings.email}
                            disabled
                            className={`w-full pl-10 pr-3 py-2 rounded-lg border ${
                              isDarkMode 
                                ? 'bg-gray-700 border-gray-600 text-gray-300' 
                                : 'bg-gray-50 border-gray-300 text-gray-500'
                            } cursor-not-allowed`}
                          />
                        </div>
                        <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                          Email cannot be changed
                        </p>
                      </div>

                      <div>
                        <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Display Name
                        </label>
                        <input
                          type="text"
                          value={settings.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          className={`w-full px-3 py-2 rounded-lg border ${
                            isDarkMode 
                              ? 'bg-gray-700 border-gray-600 text-white' 
                              : 'bg-white border-gray-300 text-gray-900'
                          } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        />
                      </div>

                      <div>
                        <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Phone Number
                        </label>
                        <div className="relative">
                          <Smartphone className={`absolute left-3 top-3 w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                          <input
                            type="tel"
                            value={settings.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            placeholder="+91 98765 43210"
                            className={`w-full pl-10 pr-3 py-2 rounded-lg border ${
                              isDarkMode 
                                ? 'bg-gray-700 border-gray-600 text-white' 
                                : 'bg-white border-gray-300 text-gray-900'
                            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                          />
                        </div>
                      </div>

                      <div>
                        <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Timezone
                        </label>
                        <div className="relative">
                          <Globe className={`absolute left-3 top-3 w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                          <select
                            value={settings.timezone}
                            onChange={(e) => handleInputChange('timezone', e.target.value)}
                            className={`w-full pl-10 pr-3 py-2 rounded-lg border ${
                              isDarkMode 
                                ? 'bg-gray-700 border-gray-600 text-white' 
                                : 'bg-white border-gray-300 text-gray-900'
                            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                          >
                            <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                            <option value="UTC">UTC</option>
                            <option value="America/New_York">America/New_York (EST)</option>
                            <option value="Europe/London">Europe/London (GMT)</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {userProfile && (
                      <div className={`mt-6 p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                        <h4 className={`font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          Account Information
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>User ID:</span>
                            <span className={`ml-2 font-mono ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                              #{userProfile.id || 'N/A'}
                            </span>
                          </div>
                          <div>
                            <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Member Since:</span>
                            <span className={`ml-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                              {formatDate(userProfile.joinDate)}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <div className="space-y-6">
                  <div>
                    <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Security Settings
                    </h3>
                    
                    {/* Change Password */}
                    <div className={`p-4 rounded-lg mb-6 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <h4 className={`font-medium mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        Change Password
                      </h4>
                      
                      <div className="space-y-4">
                        <div>
                          <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Current Password
                          </label>
                          <div className="relative">
                            <Lock className={`absolute left-3 top-3 w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                            <input
                              type={showPasswords.current ? 'text' : 'password'}
                              value={settings.currentPassword}
                              onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                              className={`w-full pl-10 pr-10 py-2 rounded-lg border ${
                                isDarkMode 
                                  ? 'bg-gray-600 border-gray-500 text-white' 
                                  : 'bg-white border-gray-300 text-gray-900'
                              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            />
                            <button
                              type="button"
                              onClick={() => togglePasswordVisibility('current')}
                              className={`absolute right-3 top-3 ${isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                              {showPasswords.current ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                              New Password
                            </label>
                            <div className="relative">
                              <Lock className={`absolute left-3 top-3 w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                              <input
                                type={showPasswords.new ? 'text' : 'password'}
                                value={settings.newPassword}
                                onChange={(e) => handleInputChange('newPassword', e.target.value)}
                                className={`w-full pl-10 pr-10 py-2 rounded-lg border ${
                                  isDarkMode 
                                    ? 'bg-gray-600 border-gray-500 text-white' 
                                    : 'bg-white border-gray-300 text-gray-900'
                                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                              />
                              <button
                                type="button"
                                onClick={() => togglePasswordVisibility('new')}
                                className={`absolute right-3 top-3 ${isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`}
                              >
                                {showPasswords.new ? <EyeOff size={16} /> : <Eye size={16} />}
                              </button>
                            </div>
                          </div>

                          <div>
                            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                              Confirm New Password
                            </label>
                            <div className="relative">
                              <Lock className={`absolute left-3 top-3 w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                              <input
                                type={showPasswords.confirm ? 'text' : 'password'}
                                value={settings.confirmPassword}
                                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                                className={`w-full pl-10 pr-10 py-2 rounded-lg border ${
                                  isDarkMode 
                                    ? 'bg-gray-600 border-gray-500 text-white' 
                                    : 'bg-white border-gray-300 text-gray-900'
                                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                              />
                              <button
                                type="button"
                                onClick={() => togglePasswordVisibility('confirm')}
                                className={`absolute right-3 top-3 ${isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`}
                              >
                                {showPasswords.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
                              </button>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={handlePasswordChange}
                          disabled={saving}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center space-x-2"
                        >
                          {saving ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
                          <span>{saving ? 'Updating...' : 'Update Password'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Two Factor Authentication */}
                    <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            Two-Factor Authentication
                          </h4>
                          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Add an extra layer of security to your account
                          </p>
                        </div>
                        <button
                          onClick={() => handleInputChange('twoFactorEnabled', !settings.twoFactorEnabled)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            settings.twoFactorEnabled ? 'bg-blue-600' : isDarkMode ? 'bg-gray-600' : 'bg-gray-200'
                          }`}
                        >
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            settings.twoFactorEnabled ? 'translate-x-6' : 'translate-x-1'
                          }`} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <div>
                    <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Notification Preferences
                    </h3>
                    
                    <div className="space-y-4">
                      {[
                        { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive notifications via email' },
                        { key: 'pushNotifications', label: 'Push Notifications', desc: 'Receive push notifications in browser' },
                        { key: 'weeklyReports', label: 'Weekly Reports', desc: 'Get weekly savings progress reports' },
                        { key: 'goalAchievements', label: 'Goal Achievements', desc: 'Celebrate when you reach your savings goals' },
                        { key: 'depositReminders', label: 'Deposit Reminders', desc: 'Gentle reminders to make regular deposits' }
                      ].map((item) => (
                        <div key={item.key} className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                {item.label}
                              </h4>
                              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                {item.desc}
                              </p>
                            </div>
                            <button
                              onClick={() => handleInputChange(item.key, !settings[item.key])}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                settings[item.key] ? 'bg-blue-600' : isDarkMode ? 'bg-gray-600' : 'bg-gray-200'
                              }`}
                            >
                              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                settings[item.key] ? 'translate-x-6' : 'translate-x-1'
                              }`} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Preferences Tab */}
              {activeTab === 'preferences' && (
                <div className="space-y-6">
                  <div>
                    <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      App Preferences
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Currency
                        </label>
                        <select
                          value={settings.currency}
                          onChange={(e) => handleInputChange('currency', e.target.value)}
                          className={`w-full px-3 py-2 rounded-lg border ${
                            isDarkMode 
                              ? 'bg-gray-700 border-gray-600 text-white' 
                              : 'bg-white border-gray-300 text-gray-900'
                          } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        >
                          <option value="INR">Indian Rupee (₹)</option>
                          <option value="USD">US Dollar ($)</option>
                          <option value="EUR">Euro (€)</option>
                          <option value="GBP">British Pound (£)</option>
                        </select>
                      </div>

                      <div>
                        <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Date Format
                        </label>
                        <select
                          value={settings.dateFormat}
                          onChange={(e) => handleInputChange('dateFormat', e.target.value)}
                          className={`w-full px-3 py-2 rounded-lg border ${
                            isDarkMode 
                              ? 'bg-gray-700 border-gray-600 text-white' 
                              : 'bg-white border-gray-300 text-gray-900'
                          } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        >
                          <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                          <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                          <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                        </select>
                      </div>

                      <div>
                        <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Language
                        </label>
                        <select
                          value={settings.language}
                          onChange={(e) => handleInputChange('language', e.target.value)}
                          className={`w-full px-3 py-2 rounded-lg border ${
                            isDarkMode 
                              ? 'bg-gray-700 border-gray-600 text-white' 
                              : 'bg-white border-gray-300 text-gray-900'
                          } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        >
                          <option value="en">English</option>
                          <option value="hi">हिन्दी (Hindi)</option>
                          <option value="mr">मराठी (Marathi)</option>
                          <option value="gu">ગુજરાતી (Gujarati)</option>
                        </select>
                      </div>
                    </div>

                    <div className="mt-6 space-y-4">
                      {[
                        { key: 'darkMode', label: 'Dark Mode', desc: 'Use dark theme for the interface', icon: isDarkMode ? Moon : Sun },
                        { key: 'autoSave', label: 'Auto Save', desc: 'Automatically save changes as you make them' },
                        { key: 'showProgress', label: 'Show Progress Animations', desc: 'Display animated progress indicators' }
                      ].map((item) => {
                        const Icon = item.icon;
                        return (
                          <div key={item.key} className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                {Icon && <Icon size={20} className={isDarkMode ? 'text-gray-400' : 'text-gray-600'} />}
                                <div>
                                  <h4 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                    {item.label}
                                  </h4>
                                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                    {item.desc}
                                  </p>
                                </div>
                              </div>
                              <button
                                onClick={() => handleInputChange(item.key, !settings[item.key])}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                  settings[item.key] ? 'bg-blue-600' : isDarkMode ? 'bg-gray-600' : 'bg-gray-200'
                                }`}
                              >
                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                  settings[item.key] ? 'translate-x-6' : 'translate-x-1'
                                }`} />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Data & Privacy Tab */}
              {activeTab === 'data' && (
                <div className="space-y-6">
                  <div>
                    <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Data Management & Privacy
                    </h3>
                    
                    {/* Export Data */}
                    <div className={`p-4 rounded-lg mb-4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            Export Your Data
                          </h4>
                          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Download a copy of all your FinJar data
                          </p>
                        </div>
                        <button
                          onClick={exportUserData}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                        >
                          <Download size={16} />
                          <span>Export</span>
                        </button>
                      </div>
                    </div>

                    {/* Privacy Settings */}
                    <div className="space-y-4">
                      {[
                        { key: 'profilePublic', label: 'Public Profile', desc: 'Make your profile visible to other users' },
                        { key: 'shareAnalytics', label: 'Share Analytics', desc: 'Help improve FinJar by sharing anonymous usage data' }
                      ].map((item) => (
                        <div key={item.key} className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                {item.label}
                              </h4>
                              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                {item.desc}
                              </p>
                            </div>
                            <button
                              onClick={() => handleInputChange(item.key, !settings[item.key])}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                settings[item.key] ? 'bg-blue-600' : isDarkMode ? 'bg-gray-600' : 'bg-gray-200'
                              }`}
                            >
                              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                settings[item.key] ? 'translate-x-6' : 'translate-x-1'
                              }`} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Danger Zone */}
                    <div className={`p-4 rounded-lg border-2 border-dashed ${
                      isDarkMode ? 'border-red-800 bg-red-900/20' : 'border-red-200 bg-red-50'
                    }`}>
                      <h4 className={`font-medium mb-2 ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>
                        Danger Zone
                      </h4>
                      <p className={`text-sm mb-4 ${isDarkMode ? 'text-red-300' : 'text-red-700'}`}>
                        These actions are permanent and cannot be undone.
                      </p>
                      <button
                        onClick={handleDeleteAccount}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
                      >
                        <Trash2 size={16} />
                        <span>Delete Account</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Save Button */}
              {activeTab !== 'security' && activeTab !== 'data' && (
                <div className="flex justify-end pt-6 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => saveSettings()}
                    disabled={saving}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center space-x-2"
                  >
                    {saving ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
                    <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;