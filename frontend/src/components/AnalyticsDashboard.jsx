import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import {
  LineChart, BarChart, PieChart, Pie,
  Line, Bar, XAxis, YAxis, Tooltip, Legend, Cell, ResponsiveContainer
} from 'recharts';

const COLORS = ['#EF4444', '#10B981', '#3B82F6', '#F59E0B'];

const AnalyticsDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tab, setTab] = useState('overview');
  const { getToken } = useAuth();

  useEffect(() => {
    fetchAnalytics();
  }, []);

  async function fetchAnalytics() {
    setLoading(true);
    try {
      const token = getToken();
      // Fix: Add the full backend URL
      const resp = await fetch('http://localhost:5000/api/analytics/dashboard', {
        headers: { 
          Authorization: `Bearer ${token}`, 
          'Content-Type': 'application/json' 
        },
      });
      
      if (resp.ok) {
        const analyticsData = await resp.json();
        setData(analyticsData);
      } else if (resp.status === 401) {
        setError('Authentication required. Please login.');
      } else {
        setError('Failed to fetch analytics data');
      }
    } catch (e) {
      setError('Network error while fetching analytics');
      console.error('Analytics fetch error:', e);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md">
        <p>{error}</p>
        <Button onClick={fetchAnalytics} className="mt-2">
          Retry
        </Button>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No analytics data available.</p>
      </div>
    );
  }

  const { riskTrends, positiveTrends, counsellingTrends } = data;

  const totalRisks = riskTrends?.reduce((s, t) => s + t.count, 0) || 0;
  const totalPositive = positiveTrends?.reduce((s, t) => s + t.count, 0) || 0;
  const totalFocus = counsellingTrends?.reduce((s, t) => s + t.count, 0) || 0;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
        <p className="text-gray-600">Comprehensive overview of counselling session analytics and trends</p>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6">
        <nav className="flex space-x-8">
          <button
            onClick={() => setTab('overview')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              tab === 'overview'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setTab('risks')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              tab === 'risks'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Risk Analysis
          </button>
          <button
            onClick={() => setTab('positive')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              tab === 'positive'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Positive Trends
          </button>
          <button
            onClick={() => setTab('counselling')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              tab === 'counselling'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Focus Areas
          </button>
        </nav>
      </div>

      {/* Content based on active tab */}
      {tab === 'overview' && (
        <div className="space-y-6">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 rounded-lg shadow-md text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Total Risk Factors</p>
                  <p className="text-3xl font-bold">{totalRisks}</p>
                </div>
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-lg shadow-md text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Positive Indicators</p>
                  <p className="text-3xl font-bold">{totalPositive}</p>
                </div>
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-lg shadow-md text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Focus Areas</p>
                  <p className="text-3xl font-bold">{totalFocus}</p>
                </div>
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk vs Positive Trends</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={[
                  { name: 'Risk Factors', value: totalRisks, fill: '#EF4444' },
                  { name: 'Positive Indicators', value: totalPositive, fill: '#10B981' }
                ]}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Focus Areas Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={counsellingTrends || []}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {counsellingTrends?.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {tab === 'risks' && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Analysis</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={riskTrends || []} margin={{ top: 20 }}>
              <XAxis dataKey="item" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#EF4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {tab === 'positive' && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Positive Trends</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={positiveTrends || []} margin={{ top: 20 }}>
              <XAxis dataKey="item" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {tab === 'counselling' && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Counselling Focus Areas</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={counsellingTrends || []} margin={{ top: 20 }}>
              <XAxis dataKey="item" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default AnalyticsDashboard;