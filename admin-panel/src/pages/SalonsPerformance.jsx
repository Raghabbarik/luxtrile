import { useState, useEffect } from 'react';
import { FiTrendingUp, FiDollarSign, FiCalendar, FiAward } from 'react-icons/fi';

const SalonsPerformance = () => {
  const [salons, setSalons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('revenue'); // revenue, bookings

  useEffect(() => {
    fetchSalonsPerformance();
  }, []);

  const fetchSalonsPerformance = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:5000/api/admin/salons-performance', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setSalons(data.data.salons);
      }
    } catch (error) {
      console.error('Failed to fetch salons performance:', error);
    } finally {
      setLoading(false);
    }
  };

  const sortedSalons = [...salons].sort((a, b) => {
    if (sortBy === 'revenue') {
      return b.totalRevenue - a.totalRevenue;
    } else {
      return b.totalBookings - a.totalBookings;
    }
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Salons Performance</h1>
          <p className="text-gray-400">Track bookings and revenue by salon</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setSortBy('revenue')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              sortBy === 'revenue'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            Sort by Revenue
          </button>
          <button
            onClick={() => setSortBy('bookings')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              sortBy === 'bookings'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            Sort by Bookings
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
        </div>
      ) : (
        <div className="grid gap-6">
            {sortedSalons.map((salon, index) => (
              <div
                key={salon._id}
                className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 hover:border-amber-500/50 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    {index < 3 && (
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        index === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' :
                        index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500' :
                        'bg-gradient-to-br from-amber-600 to-amber-800'
                      }`}>
                        <FiAward className="text-white text-xl" />
                      </div>
                    )}
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">{salon.name}</h3>
                      <p className="text-gray-400 text-sm">
                        {salon.address?.city}, {salon.address?.state}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-400 mb-1">Rank</div>
                    <div className="text-2xl font-bold text-amber-500">#{index + 1}</div>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4">
                  <div className="bg-gray-900/50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <FiDollarSign className="text-green-500" />
                      <span className="text-gray-400 text-sm">Total Revenue</span>
                    </div>
                    <div className="text-2xl font-bold text-white">
                      {formatCurrency(salon.totalRevenue || 0)}
                    </div>
                  </div>

                  <div className="bg-gray-900/50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <FiCalendar className="text-blue-500" />
                      <span className="text-gray-400 text-sm">Total Bookings</span>
                    </div>
                    <div className="text-2xl font-bold text-white">
                      {salon.totalBookings || 0}
                    </div>
                  </div>

                  <div className="bg-gray-900/50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <FiTrendingUp className="text-amber-500" />
                      <span className="text-gray-400 text-sm">Avg. Booking</span>
                    </div>
                    <div className="text-2xl font-bold text-white">
                      {salon.totalBookings > 0
                        ? formatCurrency(salon.totalRevenue / salon.totalBookings)
                        : formatCurrency(0)}
                    </div>
                  </div>

                  <div className="bg-gray-900/50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <FiAward className="text-purple-500" />
                      <span className="text-gray-400 text-sm">Rating</span>
                    </div>
                    <div className="text-2xl font-bold text-white">
                      {salon.rating?.average?.toFixed(1) || '0.0'} ⭐
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-700/50">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Owner: {salon.owner?.name || 'N/A'}</span>
                    <span className="text-gray-400">Phone: {salon.phone || 'N/A'}</span>
                    <span className="text-gray-400">
                      Reviews: {salon.rating?.count || 0}
                    </span>
                  </div>
                </div>
              </div>
            ))}

          {sortedSalons.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No salon data available</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SalonsPerformance;
