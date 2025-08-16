/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from 'react';
import api from '../services/apiService.js';

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
  
  // Delete state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [jarToDelete, setJarToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [deleteConfirmInput, setDeleteConfirmInput] = useState('');

  const hasFetchedJars = useRef(false);

  const ensureToken = () => {
    const token = localStorage.getItem('token') || localStorage.getItem('authToken');
    if (!token) {
      setError('No authentication token found. Please log in again.');
      return null;
    }
    return token;
  };

  // Delete jar
  const deleteJar = async (jarId) => {
    setDeleteLoading(true);
    setDeleteError('');
    try {
      const token = ensureToken();
      if (!token) return;

      // Cleanup deposits first (optional)
      try {
        const depositsResp = await fetch(`${api.baseURL}/api/deposits/jar/${jarId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (depositsResp.ok) {
          const deps = await depositsResp.json().catch(() => []);
          if (Array.isArray(deps)) {
            for (const d of deps) {
              await fetch(`${api.baseURL}/api/deposits/${d.id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
              });
            }
          }
        }
  } catch {
        // ignore deposit cleanup errors
      }

      const resp = await fetch(`${api.baseURL}/api/jars/${jarId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (resp.ok) {
        setJars(prev => prev.filter(j => j.id !== jarId));
        if (selectedJar && selectedJar.id === jarId) setSelectedJar(null);
        setShowDeleteModal(false);
        setJarToDelete(null);
        setDeleteConfirmInput('');
      } else if (resp.status === 401) {
        setDeleteError('Session expired. Please log in again.');
        localStorage.removeItem('token');
        localStorage.removeItem('authToken');
      } else {
        setDeleteError(`Failed to delete jar (${resp.status}).`);
      }
    } catch (err) {
      setDeleteError(err.message || 'Error deleting jar');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleDeleteJarClick = (jar, e) => {
    e.stopPropagation();
    setJarToDelete(jar);
    setShowDeleteModal(true);
    setDeleteError('');
    setDeleteConfirmInput('');
  };

  const confirmDeleteJar = () => {
    if (jarToDelete && deleteConfirmInput.toUpperCase() === 'DELETE') deleteJar(jarToDelete.id);
  };
  const cancelDeleteJar = () => {
    setShowDeleteModal(false);
    setJarToDelete(null);
    setDeleteError('');
    setDeleteConfirmInput('');
  };

  const fetchJars = async (showRefreshing = false) => {
    try {
      if (showRefreshing) setRefreshing(true);
      setError(null);
      const token = ensureToken();
      if (!token) return;
      const data = await api.getJars();
      setJars(Array.isArray(data) ? data.map(j => ({
        id: j.id,
        title: j.name || j.title || 'Unnamed Jar',
        targetAmount: j.targetAmount || 0,
        savedAmount: j.currentAmount || j.savedAmount || 0
      })) : []);
    } catch (err) {
      setError(err.message || 'Failed to fetch jars');
    } finally {
      setLoading(false);
      if (showRefreshing) setRefreshing(false);
    }
  };

  const fetchDeposits = async (jarId) => {
    try {
      const token = ensureToken();
      if (!token) return;
      const data = await api.getDeposits(jarId);
      setDeposits(Array.isArray(data) ? data.map(d => ({
        id: d.id,
        amount: d.amount,
        date: d.createdAt || d.date || d.timestamp
      })) : []);
    } catch {
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
    if (selectedJar && selectedJar.id) fetchDeposits(selectedJar.id);
  }, [selectedJar?.id]);

  const addDeposit = async () => {
    setDepositError('');
    if (!depositAmount || !selectedJar) return setDepositError('Please enter a deposit amount.');
    const amount = parseFloat(depositAmount);
    if (isNaN(amount) || amount <= 0) return setDepositError('Enter a valid amount > 0.');
    const token = ensureToken();
    if (!token) return setDepositError('Authentication required.');
    setDepositLoading(true);
    try {
      const resp = await fetch(`${api.baseURL}/api/deposits/jar/${selectedJar.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ amount, date: new Date().toISOString() })
      });
      if (resp.ok) {
        setDepositAmount('');
        await fetchDeposits(selectedJar.id);
        setSelectedJar(prev => ({ ...prev, savedAmount: prev.savedAmount + amount }));
        setJars(prev => prev.map(j => j.id === selectedJar.id ? { ...j, savedAmount: j.savedAmount + amount } : j));
      } else if (resp.status === 401) {
        setDepositError('Session expired.');
      } else {
        setDepositError('Failed to add deposit');
      }
    } catch (e) {
      setDepositError(e.message || 'Network error');
    } finally {
      setDepositLoading(false);
    }
  };

  const deleteDeposit = async (depositId) => {
    try {
      const token = ensureToken();
      if (!token) return;
      const resp = await fetch(`${api.baseURL}/api/deposits/${depositId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (resp.ok) {
        const deleted = deposits.find(d => d.id === depositId);
        if (deleted) {
          setSelectedJar(prev => ({ ...prev, savedAmount: prev.savedAmount - deleted.amount }));
          setJars(prev => prev.map(j => j.id === selectedJar.id ? { ...j, savedAmount: j.savedAmount - deleted.amount } : j));
        }
        await fetchDeposits(selectedJar.id);
      }
    } catch {/* ignore */}
  };

  const getJarValues = (jar) => {
    const currentAmount = jar.savedAmount || jar.currentAmount || 0;
    const goalAmount = jar.targetAmount || 0;
    const jarName = jar.title || jar.name || 'Unnamed Jar';
    return { currentAmount, goalAmount, jarName };
  };

  const formatCurrency = (amount) => new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(amount || 0);

  const DeleteJarModal = () => {
    if (!showDeleteModal || !jarToDelete) return null;
    const { currentAmount, goalAmount, jarName } = getJarValues(jarToDelete);
    const canDelete = deleteConfirmInput.toUpperCase() === 'DELETE';
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/50" onClick={!deleteLoading ? cancelDeleteJar : undefined} />
        <div className={`relative w-full max-w-md mx-auto rounded-2xl shadow-2xl ${
          isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
        }`}>
          <div className="p-6 pb-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-full bg-red-100">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Delete Jar</h3>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>This action cannot be undone</p>
              </div>
            </div>
            {!deleteLoading && (
              <button onClick={cancelDeleteJar} className={`p-1 rounded-full ${isDarkMode ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}>
                <span className="text-lg">✕</span>
              </button>
            )}
          </div>
          <div className="px-6 pb-4">
            <div className={`p-4 rounded-lg mb-4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <div className="flex items-center space-x-3">
                <PiggyBank className="w-8 h-8 text-blue-600" />
                <div>
                  <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{jarName}</p>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>₹{formatCurrency(currentAmount)} of ₹{formatCurrency(goalAmount)}</p>
                </div>
              </div>
            </div>
            {deleteError && (
              <div className={`p-3 rounded-lg mb-4 flex items-start space-x-2 ${isDarkMode ? 'bg-red-900/20 border border-red-800' : 'bg-red-50 border border-red-200'}`}>
                <AlertCircle className="w-4 h-4 text-red-500 mt-0.5" />
                <p className={`text-sm ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>{deleteError}</p>
              </div>
            )}
            <div className="mb-6">
              <p className={`text-sm mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Type <strong>DELETE</strong> to confirm:</p>
              <input type="text" value={deleteConfirmInput} onChange={e => setDeleteConfirmInput(e.target.value)} placeholder="Type DELETE" disabled={deleteLoading} className={`w-full px-3 py-2 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50`} />
            </div>
          </div>
          <div className="flex space-x-3 p-6 pt-0">
            <button onClick={cancelDeleteJar} disabled={deleteLoading} className={`flex-1 py-3 px-4 rounded-lg font-medium ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'} disabled:opacity-50`}>Cancel</button>
            <button onClick={confirmDeleteJar} disabled={deleteLoading || !canDelete} className="flex-1 py-3 px-4 rounded-lg font-medium bg-red-600 hover:bg-red-700 text-white disabled:opacity-50 flex items-center justify-center space-x-2">
              {deleteLoading ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /><span>Deleting...</span></> : <><Trash2 size={16} /><span>Delete Jar</span></>}
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
          <div className={`w-12 h-12 border-4 border-t-blue-600 border-r-transparent rounded-full animate-spin mb-4 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}></div>
          <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Loading jars...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center max-w-2xl px-4">
          <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-red-900 text-red-400' : 'bg-red-100 text-red-600'}`}>
            <AlertCircle className="w-8 h-8" />
          </div>
          <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Connection Error</h3>
          <div className={`text-sm mb-4 p-4 rounded-lg ${isDarkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
            <p className="font-medium mb-2">Error Details:</p>
            <p className="text-left">{error}</p>
          </div>
          <div className="space-y-2">
            <button onClick={() => { setLoading(true); fetchJars(); }} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Try Again</button>
            <button onClick={() => { localStorage.removeItem('token'); localStorage.removeItem('authToken'); window.location.reload(); }} className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">Clear Session & Reload</button>
          </div>
        </div>
      </div>
    );
  }

  if (selectedJar) {
    const { currentAmount, goalAmount, jarName } = getJarValues(selectedJar);
    const progress = goalAmount > 0 ? (currentAmount / goalAmount) * 100 : 0;
    const remainingAmount = Math.max(0, goalAmount - currentAmount);
    return (
      <div className="h-full flex flex-col">
        <DeleteJarModal />
        <div className={`flex items-center justify-between p-6 border-b ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
          <div className="flex items-center space-x-4">
            <button onClick={() => setSelectedJar(null)} className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`}><ArrowLeft size={20} /></button>
            <div className="flex items-center space-x-3">
              <PiggyBank className="w-8 h-8 text-blue-600" />
              <div>
                <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{jarName}</h2>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Savings Jar</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button onClick={() => fetchJars(true)} disabled={refreshing} className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'} ${refreshing ? 'opacity-50' : ''}`}><RefreshCw size={20} className={refreshing ? 'animate-spin' : ''} /></button>
            <button onClick={(e) => handleDeleteJarClick(selectedJar, e)} className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-red-900 text-gray-400 hover:text-red-400' : 'hover:bg-red-100 text-gray-600 hover:text-red-600'}`} title="Delete jar"><Trash2 size={20} /></button>
          </div>
        </div>
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'} shadow-sm`}>
                <div className="flex items-center space-x-3">
                  <DollarSign className="w-8 h-8 text-green-500" />
                  <div>
                    <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Current Amount</p>
                    <p className={`text-2xl font-bold ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>₹{formatCurrency(currentAmount)}</p>
                  </div>
                </div>
              </div>
              <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'} shadow-sm`}>
                <div className="flex items-center space-x-3">
                  <Target className="w-8 h-8 text-blue-500" />
                  <div>
                    <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Goal Amount</p>
                    <p className={`text-2xl font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>₹{formatCurrency(goalAmount)}</p>
                  </div>
                </div>
              </div>
              <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'} shadow-sm`}>
                <div className="flex items-center space-x-3">
                  <Activity className="w-8 h-8 text-purple-500" />
                  <div>
                    <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Progress</p>
                    <p className={`text-2xl font-bold ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}>{progress.toFixed(1)}%</p>
                  </div>
                </div>
              </div>
              <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'} shadow-sm`}>
                <div className="flex items-center space-x-3">
                  <Target className="w-8 h-8 text-orange-500" />
                  <div>
                    <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Remaining</p>
                    <p className={`text-2xl font-bold ${isDarkMode ? 'text-orange-400' : 'text-orange-600'}`}>₹{formatCurrency(remainingAmount)}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'} shadow-sm`}>
              <div className="mb-6">
                <div className="flex justify-between items-center text-sm mb-3">
                  <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Progress to Goal</span>
                  <div className="flex items-center space-x-4">
                    <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>₹{formatCurrency(currentAmount)} / ₹{formatCurrency(goalAmount)}</span>
                    <span className={`font-bold ${progress >= 100 ? 'text-green-500' : 'text-blue-500'}`}>{progress.toFixed(1)}%</span>
                  </div>
                </div>
                <div className={`w-full h-4 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                  <div className={`h-full rounded-full transition-all duration-500 ${progress >= 100 ? 'bg-green-500' : 'bg-blue-500'}`} style={{ width: `${Math.min(progress, 100)}%` }} />
                </div>
                {progress >= 100 && <div className="mt-2 text-center"><span className="text-green-500 font-semibold text-sm">🎉 Goal Achieved!</span></div>}
              </div>
            </div>
            <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'} shadow-sm`}>
              <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Add Deposit to "{jarName}"</h3>
              {depositError && (
                <div className={`mb-4 p-3 rounded-lg flex items-start space-x-2 ${isDarkMode ? 'bg-red-900/20 border border-red-800' : 'bg-red-50 border border-red-200'}`}>
                  <AlertCircle className="w-4 h-4 text-red-500 mt-0.5" />
                  <div className="flex-1"><p className={`text-sm ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>{depositError}</p></div>
                </div>
              )}
              <div className="flex space-x-4">
                <input type="number" value={depositAmount} onChange={(e) => setDepositAmount(e.target.value)} placeholder="Enter amount (₹)" step="0.01" min="0" className={`flex-1 px-4 py-2 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500`} />
                <button onClick={addDeposit} disabled={!depositAmount || depositLoading} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2">
                  {depositLoading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Plus size={16} />}
                  <span>{depositLoading ? 'Adding...' : 'Add Deposit'}</span>
                </button>
              </div>
            </div>
            <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'} shadow-sm`}>
              <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Recent Deposits</h3>
              {deposits.length === 0 ? (
                <p className={`text-center py-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>No deposits yet for this jar</p>
              ) : (
                <div className="space-y-3">
                  {deposits.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 10).map(dep => (
                    <div key={dep.id} className={`flex items-center justify-between p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <div className="flex items-center space-x-3">
                        <Calendar size={16} className={isDarkMode ? 'text-gray-400' : 'text-gray-600'} />
                        <div>
                          <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>₹{formatCurrency(dep.amount)}</p>
                          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{new Date(dep.date).toLocaleDateString('en-IN')}</p>
                        </div>
                      </div>
                      <button onClick={() => deleteDeposit(dep.id)} className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-600 text-gray-400 hover:text-red-400' : 'hover:bg-gray-200 text-gray-600 hover:text-red-600'}`} title="Delete deposit"><Trash2 size={16} /></button>
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

  return (
    <div className="h-full flex flex-col">
      <DeleteJarModal />
      <div className="p-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>My Savings Jars</h2>
          <button onClick={() => fetchJars(true)} disabled={refreshing} className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'} ${refreshing ? 'opacity-50 cursor-not-allowed' : ''}`}><RefreshCw size={20} className={refreshing ? 'animate-spin' : ''} /></button>
        </div>
        {jars.length === 0 ? (
          <div className="text-center py-12">
            <PiggyBank className={`w-16 h-16 mx-auto mb-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
            <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>No Jars Found</h3>
            <p className={`-mt-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Create your first jar to start saving!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jars.map(jar => {
              const { currentAmount, goalAmount, jarName } = getJarValues(jar);
              const progress = goalAmount > 0 ? (currentAmount / goalAmount) * 100 : 0;
              return (
                <div key={jar.id} onClick={() => setSelectedJar(jar)} className={`p-6 rounded-xl cursor-pointer transition-all duration-200 hover:scale-105 relative group ${isDarkMode ? 'bg-gray-800 hover:bg-gray-750 border border-gray-700' : 'bg-white hover:shadow-lg border border-gray-200'} shadow-sm`}>
                  <button onClick={(e) => handleDeleteJarClick(jar, e)} className={`absolute bottom-3 right-3 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 ${isDarkMode ? 'bg-gray-700 hover:bg-red-600 text-gray-400 hover:text-white' : 'bg-gray-100 hover:bg-red-500 text-gray-600 hover:text-white'}`} title="Delete jar"><Trash2 size={16} /></button>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <PiggyBank className="w-6 h-6 text-blue-600" />
                      <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{jarName}</h3>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${progress >= 100 ? 'bg-green-100 text-green-800' : progress >= 50 ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}`}>{progress.toFixed(0)}%</div>
                  </div>
                  <div className="space-y-4 pb-10">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Progress</span>
                        <span className={`font-bold ${progress >= 100 ? 'text-green-500' : 'text-blue-500'}`}>{progress.toFixed(1)}%</span>
                      </div>
                      <div className={`w-full h-3 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                        <div className={`h-full rounded-full transition-all duration-300 ${progress >= 100 ? 'bg-green-500' : 'bg-blue-500'}`} style={{ width: `${Math.min(progress, 100)}%` }} />
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <div>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Current</p>
                        <p className={`font-semibold text-lg ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>₹{formatCurrency(currentAmount)}</p>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Goal</p>
                        <p className={`font-semibold text-lg ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>₹{formatCurrency(goalAmount)}</p>
                      </div>
                    </div>
                    {goalAmount > 0 && (
                      <div className="text-center pt-2 border-t border-gray-200 dark:border-gray-700">
                        <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>{progress >= 100 ? <span className="text-green-500 font-medium">🎉 Goal Achieved!</span> : `₹${formatCurrency(goalAmount - currentAmount)} remaining`}</p>
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