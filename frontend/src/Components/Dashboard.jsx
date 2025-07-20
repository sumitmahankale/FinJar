import React, { useState, useEffect } from 'react';
import { 
  PiggyBank, 
  Plus, 
  BarChart3, 
  Settings, 
  LogOut, 
  Moon, 
  Sun, 
  Trash2,
  Edit,
  DollarSign,
  Calendar,
  Eye,
  X
} from 'lucide-react';

// Mock user data
const mockUser = {
  name: "John Doe",
  email: "john@example.com",
  avatar: "JD"
};

// Mock API functions
const mockApi = {
  getJars: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: 1,
            name: "Emergency Fund",
            targetAmount: 10000,
            currentAmount: 3500,
            createdDate: "2024-01-15",
            description: "For unexpected expenses"
          },
          {
            id: 2,
            name: "Vacation",
            targetAmount: 5000,
            currentAmount: 1200,
            createdDate: "2024-02-20",
            description: "Trip to Europe"
          },
          {
            id: 3,
            name: "New Car",
            targetAmount: 25000,
            currentAmount: 8750,
            createdDate: "2024-01-10",
            description: "Saving for a new car"
          }
        ]);
      }, 500);
    });
  },

  createJar: async (jarData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: Date.now(),
          ...jarData,
          currentAmount: 0,
          createdDate: new Date().toISOString().split('T')[0]
        });
      }, 500);
    });
  },

  updateJar: async (id, jarData) => {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ id, ...jarData }), 500);
    });
  },

  deleteJar: async () => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(true), 300);
    });
  },

  addDeposit: async () => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(true), 300);
    });
  }
};

// Sidebar Component
const Sidebar = ({ isDarkMode, activeTab, setActiveTab, onLogout }) => {
  const menuItems = [
    { id: 'jars', label: 'View My Jars', icon: Eye },
    { id: 'create', label: 'Create New Jar', icon: Plus },
    { id: 'reports', label: 'Reports', icon: BarChart3, disabled: true },
    { id: 'settings', label: 'Settings', icon: Settings, disabled: true }
  ];

  return (
    <div className={`w-64 h-screen fixed left-0 top-0 transition-colors duration-300 border-r ${
      isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
    }`}>
      {/* Logo */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <PiggyBank className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              FinJar
            </h1>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Dashboard
            </p>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">
            {mockUser.avatar}
          </div>
          <div>
            <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {mockUser.name}
            </p>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {mockUser.email}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => !item.disabled && setActiveTab(item.id)}
              disabled={item.disabled}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 text-left ${
                activeTab === item.id
                  ? 'bg-blue-600 text-white'
                  : item.disabled
                    ? isDarkMode
                      ? 'text-gray-600 cursor-not-allowed'
                      : 'text-gray-400 cursor-not-allowed'
                    : isDarkMode
                      ? 'text-gray-300 hover:bg-gray-800'
                      : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
              {item.disabled && (
                <span className="ml-auto text-xs bg-gray-500 text-white px-2 py-1 rounded">
                  Soon
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="absolute bottom-6 left-4 right-4">
        <button
          onClick={onLogout}
          className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
            isDarkMode 
              ? 'text-gray-300 hover:bg-gray-800 hover:text-red-400' 
              : 'text-gray-700 hover:bg-gray-100 hover:text-red-600'
          }`}
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

// Header Component
const Header = ({ isDarkMode, toggleDarkMode, title }) => {
  return (
    <header className={`h-16 border-b transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
    }`}>
      <div className="flex items-center justify-between h-full px-6">
        <h2 className={`text-xl font-semibold ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>
          {title}
        </h2>
        
        <button
          onClick={toggleDarkMode}
          className={`p-2 rounded-lg transition-colors duration-300 ${
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

// Jar Card Component
const JarCard = ({ jar, isDarkMode, onEdit, onDelete, onAddDeposit }) => {
  const progress = (jar.currentAmount / jar.targetAmount) * 100;
  
  return (
    <div className={`p-6 rounded-xl border-2 transition-all duration-300 hover:shadow-lg ${
      isDarkMode 
        ? 'bg-gray-800 border-gray-700 hover:border-gray-600' 
        : 'bg-white border-gray-200 hover:border-gray-300'
    }`}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className={`text-xl font-semibold mb-1 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            {jar.name}
          </h3>
          <p className={`text-sm ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {jar.description}
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(jar)}
            className={`p-2 rounded-lg transition-colors ${
              isDarkMode 
                ? 'hover:bg-gray-700 text-gray-400 hover:text-blue-400' 
                : 'hover:bg-gray-100 text-gray-600 hover:text-blue-600'
            }`}
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => onDelete(jar.id)}
            className={`p-2 rounded-lg transition-colors ${
              isDarkMode 
                ? 'hover:bg-gray-700 text-gray-400 hover:text-red-400' 
                : 'hover:bg-gray-100 text-gray-600 hover:text-red-600'
            }`}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className={`text-sm font-medium ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Progress
          </span>
          <span className={`text-sm ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {progress.toFixed(1)}%
          </span>
        </div>
        <div className={`w-full rounded-full h-3 ${
          isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
        }`}>
          <div 
            className="bg-blue-600 h-3 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(progress, 100)}%` }}
          ></div>
        </div>
      </div>

      {/* Amount Info */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <p className={`text-2xl font-bold ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            ${jar.currentAmount.toLocaleString()}
          </p>
          <p className={`text-sm ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            of ${jar.targetAmount.toLocaleString()}
          </p>
        </div>
        <button
          onClick={() => onAddDeposit(jar)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={16} />
          <span>Add Money</span>
        </button>
      </div>

      {/* Created Date */}
      <div className="flex items-center space-x-2 text-xs text-gray-500">
        <Calendar size={12} />
        <span>Created {jar.createdDate}</span>
      </div>
    </div>
  );
};

// Create Jar Form
const CreateJarForm = ({ isDarkMode, onSubmit, onCancel, editingJar = null }) => {
  const [formData, setFormData] = useState({
    name: editingJar?.name || '',
    targetAmount: editingJar?.targetAmount || '',
    description: editingJar?.description || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.targetAmount) {
      onSubmit({
        ...formData,
        targetAmount: parseFloat(formData.targetAmount)
      });
    }
  };

  return (
    <div className={`max-w-2xl mx-auto p-6 rounded-xl border ${
      isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    }`}>
      <h3 className={`text-2xl font-bold mb-6 ${
        isDarkMode ? 'text-white' : 'text-gray-900'
      }`}>
        {editingJar ? 'Edit Jar' : 'Create New Jar'}
      </h3>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label className={`block text-sm font-medium mb-2 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Jar Name *
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className={`w-full px-4 py-3 rounded-lg border transition-colors ${
              isDarkMode 
                ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500' 
                : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
            } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
            placeholder="e.g., Emergency Fund, Vacation, New Car"
          />
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Target Amount *
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="number"
              required
              min="1"
              step="0.01"
              value={formData.targetAmount}
              onChange={(e) => setFormData({...formData, targetAmount: e.target.value})}
              className={`w-full pl-12 pr-4 py-3 rounded-lg border transition-colors ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500' 
                  : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
              } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
              placeholder="10000"
            />
          </div>
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            rows={3}
            className={`w-full px-4 py-3 rounded-lg border transition-colors resize-none ${
              isDarkMode 
                ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500' 
                : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
            } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
            placeholder="What are you saving for?"
          />
        </div>

        <div className="flex space-x-4">
          <button
            type="submit"
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            {editingJar ? 'Update Jar' : 'Create Jar'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className={`flex-1 px-6 py-3 rounded-lg border transition-colors font-medium ${
              isDarkMode 
                ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

// Add Deposit Modal
const AddDepositModal = ({ jar, isDarkMode, onAdd, onClose }) => {
  const [amount, setAmount] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (amount && parseFloat(amount) > 0) {
      onAdd(jar.id, parseFloat(amount));
      setAmount('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className={`w-full max-w-md rounded-xl p-6 ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="flex items-center justify-between mb-6">
          <h3 className={`text-xl font-bold ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Add Money to {jar.name}
          </h3>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              isDarkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
            }`}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className={`block text-sm font-medium mb-2 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Amount
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="number"
                required
                min="0.01"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className={`w-full pl-12 pr-4 py-3 rounded-lg border transition-colors ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500' 
                    : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                placeholder="0.00"
                autoFocus
              />
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Add Money
            </button>
            <button
              type="button"
              onClick={onClose}
              className={`flex-1 px-6 py-3 rounded-lg border transition-colors font-medium ${
                isDarkMode 
                  ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Main Dashboard Component
export default function FinJarDashboard() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('jars');
  const [jars, setJars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingJar, setEditingJar] = useState(null);
  const [depositModalJar, setDepositModalJar] = useState(null);

  // Load jars on component mount
  useEffect(() => {
    loadJars();
  }, []);

  const loadJars = async () => {
    setLoading(true);
    try {
      const data = await mockApi.getJars();
      setJars(data);
    } catch (error) {
      console.error('Failed to load jars:', error);
    }
    setLoading(false);
  };

  const handleCreateJar = async (jarData) => {
    setLoading(true);
    try {
      const newJar = await mockApi.createJar(jarData);
      setJars([...jars, newJar]);
      setActiveTab('jars');
    } catch (error) {
      console.error('Failed to create jar:', error);
    }
    setLoading(false);
  };

  const handleUpdateJar = async (jarData) => {
    setLoading(true);
    try {
      const updatedJar = await mockApi.updateJar(editingJar.id, jarData);
      setJars(jars.map(jar => jar.id === editingJar.id ? { ...jar, ...updatedJar } : jar));
      setEditingJar(null);
      setActiveTab('jars');
    } catch (error) {
      console.error('Failed to update jar:', error);
    }
    setLoading(false);
  };

  const handleDeleteJar = async (jarId) => {
    if (window.confirm('Are you sure you want to delete this jar?')) {
      setLoading(true);
      try {
        await mockApi.deleteJar(jarId);
        setJars(jars.filter(jar => jar.id !== jarId));
      } catch (error) {
        console.error('Failed to delete jar:', error);
      }
      setLoading(false);
    }
  };

  const handleAddDeposit = async (jarId, amount) => {
    setLoading(true);
    try {
      await mockApi.addDeposit(jarId, amount);
      setJars(jars.map(jar => 
        jar.id === jarId 
          ? { ...jar, currentAmount: jar.currentAmount + amount }
          : jar
      ));
      setDepositModalJar(null);
    } catch (error) {
      console.error('Failed to add deposit:', error);
    }
    setLoading(false);
  };

  const getPageTitle = () => {
    switch (activeTab) {
      case 'jars': return 'My Jars';
      case 'create': return editingJar ? 'Edit Jar' : 'Create New Jar';
      case 'reports': return 'Reports';
      case 'settings': return 'Settings';
      default: return 'Dashboard';
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className={`animate-spin rounded-full h-12 w-12 border-b-2 ${
            isDarkMode ? 'border-blue-400' : 'border-blue-600'
          }`}></div>
        </div>
      );
    }

    switch (activeTab) {
      case 'jars':
        return (
          <div>
            {jars.length === 0 ? (
              <div className="text-center py-12">
                <PiggyBank className={`mx-auto h-16 w-16 mb-4 ${
                  isDarkMode ? 'text-gray-600' : 'text-gray-400'
                }`} />
                <h3 className={`text-xl font-semibold mb-2 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  No jars yet
                </h3>
                <p className={`mb-6 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Create your first savings jar to get started
                </p>
                <button
                  onClick={() => setActiveTab('create')}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Create Your First Jar
                </button>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {jars.map((jar) => (
                  <JarCard
                    key={jar.id}
                    jar={jar}
                    isDarkMode={isDarkMode}
                    onEdit={setEditingJar}
                    onDelete={handleDeleteJar}
                    onAddDeposit={setDepositModalJar}
                  />
                ))}
              </div>
            )}
          </div>
        );

      case 'create':
        return (
          <CreateJarForm
            isDarkMode={isDarkMode}
            editingJar={editingJar}
            onSubmit={editingJar ? handleUpdateJar : handleCreateJar}
            onCancel={() => {
              setEditingJar(null);
              setActiveTab('jars');
            }}
          />
        );

      default:
        return (
          <div className="text-center py-12">
            <h3 className={`text-xl font-semibold mb-2 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Coming Soon
            </h3>
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              This feature is under development
            </p>
          </div>
        );
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      {/* Sidebar */}
      <Sidebar
        isDarkMode={isDarkMode}
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setEditingJar(null);
        }}
        onLogout={() => {
          if (window.confirm('Are you sure you want to logout?')) {
            console.log('Logout clicked');
          }
        }}
      />

      {/* Main Content */}
      <div className="ml-64">
        {/* Header */}
        <Header
          isDarkMode={isDarkMode}
          toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
          title={getPageTitle()}
        />

        {/* Page Content */}
        <main className="p-6">
          {renderContent()}
        </main>
      </div>

      {/* Add Deposit Modal */}
      {depositModalJar && (
        <AddDepositModal
          jar={depositModalJar}
          isDarkMode={isDarkMode}
          onAdd={handleAddDeposit}
          onClose={() => setDepositModalJar(null)}
        />
      )}
    </div>
  );
}