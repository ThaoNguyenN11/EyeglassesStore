import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalUsers: 0,
    totalProducts: 0,
    bestSeller: []
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeFilter, setTimeFilter] = useState('date'); // date, week, month, year

  useEffect(() => {
    fetchDashboardData();
  }, [timeFilter]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Get stats
      const statsRes = await axios.get('http://localhost:4000/api/admin/dashboard/stats');
      if (statsRes.data) {
        setStats({
          totalOrders: statsRes.data.totalOrders || 0,
          totalRevenue: statsRes.data.totalRevenue || 0,
          totalUsers: statsRes.data.totalUsers || 0,
          totalProducts: statsRes.data.totalProducts || 0,
          bestSeller: Array.isArray(statsRes.data.bestSeller) ? statsRes.data.bestSeller : []
        });
      }

      // Get recent orders
      const ordersRes = await axios.get('http://localhost:4000/api/admin/dashboard/recent-orders');
      setRecentOrders(Array.isArray(ordersRes.data.data) ? ordersRes.data.data : []);
      
      // Get revenue data based on selected time filter
      let revenueEndpoint;
      switch (timeFilter) {
        case 'week':
          revenueEndpoint = 'http://localhost:4000/api/admin/dashboard/revenue-by-week';
          break;
        case 'month':
          revenueEndpoint = 'http://localhost:4000/api/admin/dashboard/revenue-by-month';
          break;
        case 'year':
          revenueEndpoint = 'http://localhost:4000/api/admin/dashboard/revenue-by-year';
          break;
        default:
          revenueEndpoint = 'http://localhost:4000/api/admin/dashboard/revenue-by-date';
      }
      
      const revenueRes = await axios.get(revenueEndpoint);
      
      let formattedRevenueData = [];
      if (revenueRes.data) {
        if (Array.isArray(revenueRes.data)) {
          formattedRevenueData = revenueRes.data.map(item => ({
            date: item._id,
            revenue: item.total
          }));
        } else if (typeof revenueRes.data === 'object') {
          const dataArray = revenueRes.data.result || revenueRes.data.data;
          if (Array.isArray(dataArray)) {
            formattedRevenueData = dataArray.map(item => ({
              date: item._id,
              revenue: item.total
            }));
          }
        }
      }
      setRevenueData(formattedRevenueData);
      
      // Get low stock products
      const lowStockRes = await axios.get('http://localhost:4000/api/admin/dashboard/low-stock');
      setLowStockProducts(Array.isArray(lowStockRes.data) ? lowStockRes.data : []);

      setLoading(false);
    } catch (err) {
      console.error('Dashboard error:', err);
      setError('Error occurred while loading dashboard: ' + (err.message || 'Unknown error'));
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const getTimeFilterLabel = () => {
    switch (timeFilter) {
      case 'week': return 'Weekly';
      case 'month': return 'Monthly';
      case 'year': return 'Yearly';
      default: return 'Daily';
    }
  };

  const formatXAxisTick = (value) => {
    if (timeFilter === 'month') {
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return monthNames[value - 1];
    }
    return value;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <div className="mt-4 text-xl font-semibold text-gray-600">Loading dashboard data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="text-red-600 text-5xl mb-4">⚠️</div>
        <div className="text-xl font-semibold text-red-600 mb-2">Dashboard Error</div>
        <div className="text-gray-600 max-w-md text-center">{error}</div>
        <button 
          onClick={fetchDashboardData}
          className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Dashboard</h1>
      
      {/* Stats Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="text-sm font-medium text-gray-500 mb-1">Total Orders</div>
          <div className="text-3xl font-bold text-indigo-600">{stats.totalOrders}</div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="text-sm font-medium text-gray-500 mb-1">Total Revenue</div>
          <div className="text-3xl font-bold text-green-600">{formatCurrency(stats.totalRevenue)}</div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="text-sm font-medium text-gray-500 mb-1">Total Users</div>
          <div className="text-3xl font-bold text-blue-600">{stats.totalUsers}</div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="text-sm font-medium text-gray-500 mb-1">Total Products</div>
          <div className="text-3xl font-bold text-yellow-600">{stats.totalProducts}</div>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">{getTimeFilterLabel()} Revenue</h2>
          <div className="flex space-x-2">
            <button 
              onClick={() => setTimeFilter('date')}
              className={`px-3 py-1 rounded-lg text-sm font-medium ${
                timeFilter === 'date' 
                  ? 'bg-indigo-100 text-indigo-700' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Daily
            </button>
            <button 
              onClick={() => setTimeFilter('week')}
              className={`px-3 py-1 rounded-lg text-sm font-medium ${
                timeFilter === 'week' 
                  ? 'bg-indigo-100 text-indigo-700' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Weekly
            </button>
            <button 
              onClick={() => setTimeFilter('month')}
              className={`px-3 py-1 rounded-lg text-sm font-medium ${
                timeFilter === 'month' 
                  ? 'bg-indigo-100 text-indigo-700' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Monthly
            </button>
            <button 
              onClick={() => setTimeFilter('year')}
              className={`px-3 py-1 rounded-lg text-sm font-medium ${
                timeFilter === 'year' 
                  ? 'bg-indigo-100 text-indigo-700' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Yearly
            </button>
          </div>
        </div>
        
        {revenueData.length > 0 ? (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={revenueData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={formatXAxisTick}
                />
                <YAxis />
                <Tooltip 
                  formatter={(value) => formatCurrency(value)}
                  labelFormatter={(value) => {
                    if (timeFilter === 'month') {
                      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                                         'July', 'August', 'September', 'October', 'November', 'December'];
                      return monthNames[value - 1];
                    }
                    return value;
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#8884d8" 
                  strokeWidth={2}
                  activeDot={{ r: 8 }} 
                  name="Revenue" 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex items-center justify-center h-60 bg-gray-50 rounded">
            <p className="text-gray-500">No revenue data available for the selected period</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Recent Orders</h2>
          {recentOrders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-2 px-4 text-left rounded-tl-lg">Name</th>
                    <th className="py-2 px-4 text-left">Total</th>
                    <th className="py-2 px-4 text-left rounded-tr-lg">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order._id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="py-3 px-4">{order.userID?.name || 'Guest'}</td>
                      <td className="py-3 px-4">{formatCurrency(order.totalPrice || 0)}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          order.isPaid ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.isPaid ? 'Paid' : 'Pending Payment'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex items-center justify-center h-40 bg-gray-50 rounded">
              <p className="text-gray-500">No recent orders.</p>
            </div>
          )}
        </div>

        {/* Low Stock Products */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Low-Stock Products</h2>
          {lowStockProducts.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-2 px-4 text-left rounded-tl-lg">Product</th>
                    <th className="py-2 px-4 text-left">Variation</th>
                    <th className="py-2 px-4 text-left rounded-tr-lg">Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {lowStockProducts.flatMap((product) => {
                    if (!product.variations || !Array.isArray(product.variations)) {
                      return (
                        <tr key={product._id} className="border-b border-gray-200 hover:bg-gray-50">
                          <td className="py-3 px-4">{product.name || 'N/A'}</td>
                          <td className="py-3 px-4">N/A</td>
                          <td className="py-3 px-4">N/A</td>
                        </tr>
                      );
                    }
                    
                    const lowStockVariations = product.variations.filter(v => v && v.quantity < 5);
                    
                    if (lowStockVariations.length === 0) {
                      return null;
                    }
                    
                    return lowStockVariations.map((variation, index) => (
                      <tr key={`${product._id}-${index}`} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="py-3 px-4">{product.name || 'N/A'}</td>
                        <td className="py-3 px-4">{variation.name || variation.size || 'N/A'}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            variation.quantity <= 1 ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800'
                          }`}>
                            {variation.quantity}
                          </span>
                        </td>
                      </tr>
                    ));
                  }).filter(Boolean)}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex items-center justify-center h-40 bg-gray-50 rounded">
              <p className="text-gray-500">No low-stock products found.</p>
            </div>
          )}
        </div>
      </div>

      {/* Best Sellers */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Best Selling Products</h2>
        {stats.bestSeller && stats.bestSeller.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {stats.bestSeller.map((product) => (
              <div key={product._id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="h-40 bg-gray-200">
                  {product.images && product.images[0] ? (
                    <img 
                      src={product.images[0]} 
                      alt={product.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full bg-gray-200 text-gray-400">
                      No image available
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <h3 className="font-medium text-gray-800 truncate">{product.name || 'N/A'}</h3>
                  <div className="text-sm text-gray-500 mt-1">{formatCurrency(product.price || 0)}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-40 bg-gray-50 rounded">
            <p className="text-gray-500">No best seller products found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;