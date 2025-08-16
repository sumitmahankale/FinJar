import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import api from '../services/apiService.js';
import { 
  BarChart3, 
  TrendingUp, 
  PieChart, 
  Calendar,
  DollarSign,
  Target,
  Activity,
  AlertCircle,
  RefreshCw,
  Download,
  Filter,
  ChevronDown,
  PiggyBank,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

const Reports = ({ isDarkMode = false }) => {
  const [jars, setJars] = useState([]);
  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('all'); // all, month, quarter, year
  const [selectedJar, setSelectedJar] = useState('all'); // all or specific jar id
  const [reportData, setReportData] = useState(null);
  
  const hasFetchedData = useRef(false);

  // Get auth token from localStorage
  const getAuthToken = useCallback(() => {
    let token = localStorage.getItem('token');
    if (!token) token = localStorage.getItem('authToken');
    if (!token) {
      setError('No authentication token found. Please log in again.');
      return null;
    }
    return token;
  }, []);

  // Fetch user's jars
  const fetchJars = useCallback(async (showRefreshing = false) => {
    try {
      if (showRefreshing) setRefreshing(true);
      setError(null);
      if (!getAuthToken()) return;
      const rawJars = await api.getJars();
      const normalized = rawJars.map(j => ({
        id: j.id,
        title: j.name || j.title || 'Unnamed Jar',
        targetAmount: j.targetAmount ?? 0,
        savedAmount: j.currentAmount ?? j.savedAmount ?? 0,
        createdDate: j.createdAt ? new Date(j.createdAt).toISOString() : undefined
      }));
      setJars(normalized);
    } catch (err) {
      console.error('Error fetching jars for reports:', err);
      setError(err.message || 'Failed to fetch jars');
    } finally {
      setLoading(false);
      if (showRefreshing) setRefreshing(false);
    }
  }, [getAuthToken]);

  // Fetch all deposits for all jars
  const fetchAllDeposits = useCallback(async () => {
    try {
      if (!getAuthToken() || jars.length === 0) return;
      const all = await Promise.all(jars.map(async jar => {
        try {
          const deps = await api.getDeposits(jar.id);
          return deps.map(d => ({
            id: d.id,
            amount: d.amount ?? 0,
            date: d.createdAt ? new Date(d.createdAt).toISOString() : (d.date || new Date().toISOString()),
            jarId: jar.id,
            jarTitle: jar.title
          }));
        } catch (e) {
          console.warn('Failed to fetch deposits for jar', jar.id, e);
          return [];
        }
      }));
      setDeposits(all.flat());
    } catch (err) {
      console.error('Error fetching all deposits:', err);
    }
  }, [jars, getAuthToken]);

  // Calculate report data based on filters
  const calculateReportData = useCallback(() => {
    if (jars.length === 0) return null;

    const now = new Date();
    let startDate = new Date(0); // Beginning of time

    // Filter by period
   // ...existing code...

// Filter by period
switch (selectedPeriod) {
  case 'month':
    startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    break;
  case 'quarter': {
    const quarterStart = Math.floor(now.getMonth() / 3) * 3;
    startDate = new Date(now.getFullYear(), quarterStart, 1);
    break;
  }
  case 'year':
    startDate = new Date(now.getFullYear(), 0, 1);
    break;
  default:
    startDate = new Date(0);
}

// ...existing code...

    // Filter jars
    const filteredJars = selectedJar === 'all' ? jars : jars.filter(jar => jar.id.toString() === selectedJar);
    
    // Filter deposits
    const filteredDeposits = deposits.filter(deposit => {
      const depositDate = new Date(deposit.date);
      const isInPeriod = depositDate >= startDate;
      const isInJar = selectedJar === 'all' || deposit.jarId.toString() === selectedJar;
      return isInPeriod && isInJar;
    });

    // Calculate totals
    const totalSaved = filteredJars.reduce((sum, jar) => sum + (jar.savedAmount || 0), 0);
    const totalTarget = filteredJars.reduce((sum, jar) => sum + (jar.targetAmount || 0), 0);
    const totalDeposits = filteredDeposits.reduce((sum, deposit) => sum + (deposit.amount || 0), 0);
    const avgProgress = filteredJars.length > 0 
      ? filteredJars.reduce((sum, jar) => {
          const progress = jar.targetAmount > 0 ? (jar.savedAmount / jar.targetAmount) * 100 : 0;
          return sum + progress;
        }, 0) / filteredJars.length 
      : 0;

    // Jar performance
    const jarPerformance = filteredJars.map(jar => ({
      id: jar.id,
      title: jar.title,
      saved: jar.savedAmount || 0,
      target: jar.targetAmount || 0,
      progress: jar.targetAmount > 0 ? (jar.savedAmount / jar.targetAmount) * 100 : 0,
      remaining: Math.max(0, (jar.targetAmount || 0) - (jar.savedAmount || 0))
    })).sort((a, b) => b.progress - a.progress);

    // Monthly trend (last 6 months)
    const monthlyTrend = [];
    for (let i = 5; i >= 0; i--) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
      
      const monthDeposits = deposits.filter(deposit => {
        const depositDate = new Date(deposit.date);
        return depositDate >= monthDate && depositDate <= monthEnd;
      });
      
      const monthTotal = monthDeposits.reduce((sum, deposit) => sum + (deposit.amount || 0), 0);
      
      monthlyTrend.push({
        month: monthDate.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }),
        amount: monthTotal,
        deposits: monthDeposits.length
      });
    }

    return {
      summary: {
        totalSaved,
        totalTarget,
        totalDeposits,
        avgProgress,
        jarCount: filteredJars.length,
        depositCount: filteredDeposits.length
      },
      jarPerformance,
      monthlyTrend,
      filteredJars,
      filteredDeposits
    };
  }, [jars, deposits, selectedPeriod, selectedJar]);

  useEffect(() => {
    if (!hasFetchedData.current) {
      hasFetchedData.current = true;
      fetchJars();
    }
  }, [fetchJars]);

  useEffect(() => {
    if (jars.length > 0) {
      fetchAllDeposits();
    }
  }, [jars, fetchAllDeposits]);

  const memoReport = useMemo(() => calculateReportData(), [calculateReportData]);
  useEffect(() => { setReportData(memoReport); }, [memoReport]);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 2,
      minimumFractionDigits: 0
    }).format(amount || 0);
  };

  // Export functionality
  const exportReport = () => {
    if (!reportData) return;

    const csvData = [
      ['Jar Name', 'Target Amount', 'Saved Amount', 'Progress %', 'Remaining Amount'],
      ...reportData.jarPerformance.map(jar => [
        jar.title,
        jar.target,
        jar.saved,
        jar.progress.toFixed(2),
        jar.remaining
      ])
    ];

    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `finjar-report-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className={`w-12 h-12 border-4 border-t-blue-600 border-r-transparent rounded-full animate-spin mb-4 ${
            isDarkMode ? 'border-gray-700' : 'border-gray-200'
          }`}></div>
          <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Loading reports...</p>
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

  return (
    <div className="h-full flex flex-col">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Financial Reports
            </h2>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Analyze your savings progress and trends
            </p>
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
              onClick={exportReport}
              disabled={!reportData}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center space-x-2"
            >
              <Download size={16} />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className={`p-4 rounded-lg mb-6 ${
          isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
        }`}>
          <div className="flex flex-wrap gap-4">
            {/* Period Filter */}
            <div className="flex items-center space-x-2">
              <Filter size={16} className={isDarkMode ? 'text-gray-400' : 'text-gray-600'} />
              <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Period:
              </span>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className={`px-3 py-1 rounded border ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                <option value="all">All Time</option>
                <option value="year">This Year</option>
                <option value="quarter">This Quarter</option>
                <option value="month">This Month</option>
              </select>
            </div>

            {/* Jar Filter */}
            <div className="flex items-center space-x-2">
              <PiggyBank size={16} className={isDarkMode ? 'text-gray-400' : 'text-gray-600'} />
              <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Jar:
              </span>
              <select
                value={selectedJar}
                onChange={(e) => setSelectedJar(e.target.value)}
                className={`px-3 py-1 rounded border ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                <option value="all">All Jars</option>
                {jars.map(jar => (
                  <option key={jar.id} value={jar.id.toString()}>
                    {jar.title}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {jars.length === 0 ? (
          <div className="text-center py-12">
            <BarChart3 className={`w-16 h-16 mx-auto mb-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
            <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              No Data Available
            </h3>
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Create some jars to see your financial reports!
            </p>
          </div>
        ) : reportData && (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className={`p-6 rounded-xl ${
                isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
              } shadow-sm`}>
                <div className="flex items-center space-x-3">
                  <DollarSign className="w-8 h-8 text-green-500" />
                  <div>
                    <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Total Saved
                    </p>
                    <p className={`text-2xl font-bold ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                      ₹{formatCurrency(reportData.summary.totalSaved)}
                    </p>
                  </div>
                </div>
              </div>

              <div className={`p-6 rounded-xl ${
                isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
              } shadow-sm`}>
                <div className="flex items-center space-x-3">
                  <Target className="w-8 h-8 text-blue-500" />
                  <div>
                    <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Total Target
                    </p>
                    <p className={`text-2xl font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                      ₹{formatCurrency(reportData.summary.totalTarget)}
                    </p>
                  </div>
                </div>
              </div>

              <div className={`p-6 rounded-xl ${
                isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
              } shadow-sm`}>
                <div className="flex items-center space-x-3">
                  <Activity className="w-8 h-8 text-purple-500" />
                  <div>
                    <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Avg Progress
                    </p>
                    <p className={`text-2xl font-bold ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                      {reportData.summary.avgProgress.toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>

              <div className={`p-6 rounded-xl ${
                isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
              } shadow-sm`}>
                <div className="flex items-center space-x-3">
                  <TrendingUp className="w-8 h-8 text-orange-500" />
                  <div>
                    <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Total Deposits
                    </p>
                    <p className={`text-2xl font-bold ${isDarkMode ? 'text-orange-400' : 'text-orange-600'}`}>
                      {reportData.summary.depositCount}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Monthly Trend Chart */}
            <div className={`p-6 rounded-xl ${
              isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
            } shadow-sm`}>
              <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Monthly Savings Trend
              </h3>
              <div className="space-y-4">
                {reportData.monthlyTrend.map((month, index) => {
                  const maxAmount = Math.max(...reportData.monthlyTrend.map(m => m.amount));
                  const width = maxAmount > 0 ? (month.amount / maxAmount) * 100 : 0;
                  
                  return (
                    <div key={index} className="flex items-center space-x-4">
                      <div className={`w-20 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {month.month}
                      </div>
                      <div className="flex-1">
                        <div className={`h-8 rounded-lg relative ${
                          isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                        }`}>
                          <div 
                            className="h-full bg-blue-500 rounded-lg transition-all duration-500"
                            style={{ width: `${width}%` }}
                          ></div>
                          <div className="absolute inset-0 flex items-center px-3">
                            <span className={`text-sm font-medium ${
                              width > 50 ? 'text-white' : isDarkMode ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                              ₹{formatCurrency(month.amount)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className={`w-16 text-sm text-right ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {month.deposits} deposits
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Jar Performance */}
            <div className={`p-6 rounded-xl ${
              isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
            } shadow-sm`}>
              <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Jar Performance
              </h3>
              <div className="space-y-4">
                {reportData.jarPerformance.map((jar, index) => (
                  <div key={jar.id} className={`p-4 rounded-lg ${
                    isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {jar.title}
                      </h4>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          jar.progress >= 100
                            ? 'bg-green-100 text-green-800'
                            : jar.progress >= 50
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {jar.progress.toFixed(1)}%
                        </span>
                        {index === 0 && (
                          <ArrowUp className="w-4 h-4 text-green-500" title="Top Performer" />
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                      <div>
                        <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Saved
                        </p>
                        <p className={`font-semibold ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                          ₹{formatCurrency(jar.saved)}
                        </p>
                      </div>
                      <div>
                        <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Target
                        </p>
                        <p className={`font-semibold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                          ₹{formatCurrency(jar.target)}
                        </p>
                      </div>
                      <div>
                        <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Remaining
                        </p>
                        <p className={`font-semibold ${isDarkMode ? 'text-orange-400' : 'text-orange-600'}`}>
                          ₹{formatCurrency(jar.remaining)}
                        </p>
                      </div>
                    </div>
                    
                    <div className={`w-full h-2 rounded-full ${isDarkMode ? 'bg-gray-600' : 'bg-gray-200'}`}>
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          jar.progress >= 100 ? 'bg-green-500' : 'bg-blue-500'
                        }`}
                        style={{ width: `${Math.min(jar.progress, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;