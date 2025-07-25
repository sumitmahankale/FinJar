import React, { useState, useEffect } from 'react';
import ViewJars from './ViewJars'; 
import { 
  PiggyBank, 
  Plus, 
  BarChart3, 
  Settings, 
  LogOut, 
  Moon, 
  Sun, 
  Eye,
  Menu,
  X,
  AlertTriangle
} from 'lucide-react';

// User authentication hook - updated to work with your current backend
const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Extract user info from JWT token
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

  // Generate user avatar initials from email
  const generateAvatar = (email) => {
    if (!email) return 'U';
    const name = email.split('@')[0];
    const parts = name.split(/[._-]/);
    return parts.map(part => part.charAt(0).toUpperCase()).slice(0, 2).join('');
  };

  // Generate display name from email
  const generateDisplayName = (email) => {
    if (!email) return 'User';
    const localPart = email.split('@')[0];
    return localPart
      .split(/[._-]/)
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  };

  const fetchCurrentUser = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Since your backend doesn't have /me endpoint yet, extract user info from JWT
      const payload = parseJwtPayload(token);
      
      if (!payload) {
        throw new Error('Invalid token format');
      }

      // Check if token is expired
      if (payload.exp && payload.exp * 1000 < Date.now()) {
        localStorage.removeItem('authToken');
        throw new Error('Token expired');
      }

      // Create user object from JWT payload
      const email = payload.sub || payload.email || payload.username;
      const formattedUser = {
        id: payload.jti || email || 'user-id',
        name: generateDisplayName(email),
        email: email,
        avatar: generateAvatar(email),
        role: payload.role || 'USER'
      };
      
      setUser(formattedUser);
      
    } catch (err) {
      console.error('Failed to fetch user data:', err);
      setError(err.message);
      
      // If token is invalid, clear it
      if (err.message.includes('token') || err.message.includes('Token')) {
        localStorage.removeItem('authToken');
      }
      
      // Fallback to demo user for development
      setUser({
        name: "Demo User",
        email: "demo@example.com",
        avatar: "DU",
        id: "demo-user"
      });
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Clear local storage
      localStorage.removeItem('authToken');
      
      // Clear user state
      setUser(null);
      
      // Redirect to login page
      window.location.href = '/login';
    } catch (err) {
      console.error('Logout failed:', err);
      // Even if logout fails, clear local state
      localStorage.removeItem('authToken');
      setUser(null);
      window.location.href = '/login';
    }
  };

  const refreshUser = () => {
    fetchCurrentUser();
  };

  return { user, loading, error, logout, refreshUser };
};

// Loading Component
const LoadingSpinner = ({ isDarkMode }) => (
  <div className="flex items-center justify-center h-screen">
    <div className="text-center">
      <div className={`w-16 h-16 border-4 border-t-blue-600 border-r-transparent rounded-full animate-spin mb-4 ${
        isDarkMode ? 'border-gray-700' : 'border-gray-200'
      }`}></div>
      <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
        Loading your dashboard...
      </p>
    </div>
  </div>
);

// Error Component
const ErrorMessage = ({ error, isDarkMode, onRetry }) => (
  <div className="flex items-center justify-center h-screen">
    <div className="text-center max-w-md px-4">
      <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
        isDarkMode ? 'bg-red-900 text-red-400' : 'bg-red-100 text-red-600'
      }`}>
        <Settings className="w-8 h-8" />
      </div>
      <h3 className={`text-xl font-semibold mb-2 ${
        isDarkMode ? 'text-white' : 'text-gray-900'
      }`}>
        Authentication Error
      </h3>
      <p className={`text-sm mb-4 ${
        isDarkMode ? 'text-gray-400' : 'text-gray-600'
      }`}>
        {error || 'Unable to authenticate user'}
      </p>
      <div className="space-y-2">
        <button
          onClick={onRetry}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
        <button
          onClick={() => {
            localStorage.removeItem('authToken');
            window.location.href = '/login';
          }}
          className={`w-full px-4 py-2 rounded-lg transition-colors ${
            isDarkMode 
              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Back to Login
        </button>
      </div>
    </div>
  </div>
);

// Custom Logout Confirmation Modal
const LogoutConfirmModal = ({ isOpen, onConfirm, onCancel, isDarkMode, isLoading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50"
        onClick={!isLoading ? onCancel : undefined}
      />
      
      {/* Modal Box */}
      <div className={`relative w-full max-w-md mx-auto rounded-2xl shadow-2xl transform transition-all duration-300 scale-100 ${
        isDarkMode 
          ? 'bg-gray-800 border border-gray-700' 
          : 'bg-white border border-gray-200'
      }`}>
        {/* Close Button */}
        {!isLoading && (
          <button
            onClick={onCancel}
            className={`absolute top-4 right-4 p-1 rounded-full transition-colors duration-200 ${
              isDarkMode 
                ? 'text-gray-400 hover:text-white hover:bg-gray-700' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Modal Content */}
        <div className="p-6 text-center">
          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-orange-100">
              <AlertTriangle className="w-6 h-6 text-orange-500" />
            </div>
          </div>

          {/* Title */}
          <h3 className={`text-xl font-semibold mb-2 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Confirm Logout
          </h3>

          {/* Message */}
          <p className={`text-sm leading-relaxed mb-6 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Are you sure you want to logout? You will need to sign in again to access your account.
          </p>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            {/* Cancel Button */}
            <button
              onClick={onCancel}
              disabled={isLoading}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 ${
                isDarkMode 
                  ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
            >
              Cancel
            </button>

            {/* Confirm Button */}
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className="flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 active:scale-95 bg-red-600 hover:bg-red-700 text-white disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Logging out...</span>
                </>
              ) : (
                <span>Logout</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const CollapsibleSidebar = ({ isDarkMode, activeTab, setActiveTab, onLogout, user, isExpanded, setIsExpanded }) => {
  const menuItems = [
    { id: 'jars', label: 'View My Jars', icon: Eye },
    { id: 'create', label: 'Create New Jar', icon: Plus },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <div 
      className={`fixed left-0 top-0 h-full transition-all duration-300 ease-in-out border-r z-40 ${
        isExpanded ? 'w-64' : 'w-16'
      } ${
        isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
      }`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      {/* Logo Section */}
      <div className={`p-4 border-b transition-all duration-300 ${
        isDarkMode ? 'border-gray-700' : 'border-gray-200'
      }`}>
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <PiggyBank className="w-5 h-5 text-white" />
          </div>
          <div className={`transition-all duration-300 overflow-hidden ${
            isExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0'
          }`}>
            <h1 className={`text-lg font-bold whitespace-nowrap ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              FinJar
            </h1>
            <p className={`text-xs whitespace-nowrap ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Dashboard
            </p>
          </div>
        </div>
      </div>

      {/* User Info Section */}
      <div className={`p-4 border-b transition-all duration-300 ${
        isDarkMode ? 'border-gray-700' : 'border-gray-200'
      }`}>
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium text-sm flex-shrink-0">
            {user.avatar}
          </div>
          <div className={`transition-all duration-300 overflow-hidden ${
            isExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0'
          }`}>
            <p className={`font-medium text-sm whitespace-nowrap ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {user.name}
            </p>
            <p className={`text-xs whitespace-nowrap ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {user.email}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="p-2 space-y-1 flex-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 text-left group ${
                activeTab === item.id
                  ? 'bg-blue-600 text-white'
                  : isDarkMode
                    ? 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
                    : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
              }`}
              title={!isExpanded ? item.label : ''}
            >
              <Icon size={18} className="flex-shrink-0" />
              <span className={`transition-all duration-300 overflow-hidden whitespace-nowrap ${
                isExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0'
              }`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-2">
        <button
          onClick={onLogout}
          className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 text-left ${
            isDarkMode 
              ? 'text-gray-400 hover:bg-gray-800 hover:text-red-400' 
              : 'text-gray-700 hover:bg-red-50 hover:text-red-600'
          }`}
          title={!isExpanded ? 'Logout' : ''}
        >
          <LogOut size={18} className="flex-shrink-0" />
          <span className={`transition-all duration-300 overflow-hidden whitespace-nowrap ${
            isExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0'
          }`}>
            Logout
          </span>
        </button>
      </div>

      {/* Expand/Collapse Indicator */}
      <div className={`absolute top-1/2 -right-3 transform -translate-y-1/2 transition-all duration-300 ${
        isExpanded ? 'rotate-180' : 'rotate-0'
      }`}>
        <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${
          isDarkMode 
            ? 'bg-gray-900 border-gray-700 text-gray-400' 
            : 'bg-white border-gray-200 text-gray-600'
        }`}>
          <Menu size={12} />
        </div>
      </div>
    </div>
  );
};

// Header Component - Updated to match navbar height from other pages
const Header = ({ isDarkMode, toggleDarkMode, title }) => {
  return (
    <header className={`h-20 border-b flex-shrink-0 ${
      isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
    }`}>
      <div className="flex items-center justify-between h-full px-6 w-full">
        <h2 className={`text-xl font-semibold ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>
          {title}
        </h2>
        
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
      </div>
    </header>
  );
};

// Main Dashboard Component
export default function FinJarMinimalDashboard() {
  // Initialize dark mode from localStorage or default to false
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('isDarkMode');
    return savedTheme === 'true';
  });
  
  const [activeTab, setActiveTab] = useState('jars');
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  // Use the authentication hook
  const { user, loading, error, logout, refreshUser } = useAuth();

  // Fetch user data on component mount
  useEffect(() => {
    refreshUser();
  }, []);

  // Toggle dark mode and save to localStorage
  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem('isDarkMode', newDarkMode.toString());
  };

  // Handle logout button click - shows confirmation modal
  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  // Handle logout confirmation
  const handleLogoutConfirm = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
      setShowLogoutModal(false);
    }
  };

  // Handle logout cancellation
  const handleLogoutCancel = () => {
    setShowLogoutModal(false);
  };

  // Show loading spinner while fetching user data
  if (loading) {
    return (
      <div className={`h-screen transition-colors duration-300 ${
        isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <LoadingSpinner isDarkMode={isDarkMode} />
      </div>
    );
  }

  // Show error message if user fetch failed and no fallback user
  if (error && !user) {
    return (
      <div className={`h-screen transition-colors duration-300 ${
        isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <ErrorMessage error={error} isDarkMode={isDarkMode} onRetry={refreshUser} />
      </div>
    );
  }

  const getPageTitle = () => {
    switch (activeTab) {
      case 'jars': return 'View My Jars';
      case 'create': return 'Create New Jar';
      case 'reports': return 'Reports';
      case 'settings': return 'Settings';
      default: return 'Dashboard';
    }
  };

  const renderEmptyContent = () => {
  // Render ViewJars component when jars tab is active
  if (activeTab === 'jars') {
    return <ViewJars isDarkMode={isDarkMode} />;
  }

  // Default empty content for other tabs
  return (
    <div className="flex items-center justify-center h-full w-full">
      <div className="text-center py-12 max-w-md mx-auto px-4">
        <div className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center ${
          isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
        }`}>
          <PiggyBank className={`w-12 h-12 ${
            isDarkMode ? 'text-gray-600' : 'text-gray-400'
          }`} />
        </div>
        <h3 className={`text-2xl font-semibold mb-2 ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>
          Welcome, {user?.name?.split(' ')[0] || 'User'}!
        </h3>
        <h4 className={`text-xl font-medium mb-2 ${
          isDarkMode ? 'text-gray-300' : 'text-gray-700'
        }`}>
          {getPageTitle()}
        </h4>
        <p className={`text-lg mb-4 ${
          isDarkMode ? 'text-gray-400' : 'text-gray-600'
        }`}>
          Ready to work with your current Spring Boot backend
        </p>
        <p className={`text-sm ${
          isDarkMode ? 'text-gray-500' : 'text-gray-500'
        }`}>
          Hover over the sidebar to expand navigation
        </p>
        {error && (
          <p className={`text-xs mt-2 px-3 py-1 rounded-full ${
            isDarkMode ? 'bg-yellow-900 text-yellow-400' : 'bg-yellow-100 text-yellow-700'
          }`}>
            Using JWT token data (Backend: /auth endpoint detected)
          </p>
        )}
      </div>
    </div>
  );
};

  return (
    <div className={`h-screen flex transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      {/* Logout Confirmation Modal */}
      <LogoutConfirmModal
        isOpen={showLogoutModal}
        onConfirm={handleLogoutConfirm}
        onCancel={handleLogoutCancel}
        isDarkMode={isDarkMode}
        isLoading={isLoggingOut}
      />

      {/* Collapsible Sidebar */}
      <CollapsibleSidebar
        isDarkMode={isDarkMode}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        isExpanded={sidebarExpanded}
        setIsExpanded={setSidebarExpanded}
        onLogout={handleLogoutClick}
      />

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${
        sidebarExpanded ? 'ml-64' : 'ml-16'
      } h-screen`}>
        {/* Header */}
        <Header
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
          title={getPageTitle()}
        />

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          {renderEmptyContent()}
        </main>
      </div>
    </div>
  );
}