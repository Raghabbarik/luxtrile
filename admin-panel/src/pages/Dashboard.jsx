import { useState, useEffect } from 'react';
import { 
  MdStore, 
  MdPeople, 
  MdCalendarToday, 
  MdTrendingUp,
  MdPending,
  MdCheckCircle,
  MdArrowForward
} from 'react-icons/md';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../utils/api';

const mockChartData = [
  { name: 'Jan', revenue: 4000, users: 2400 },
  { name: 'Feb', revenue: 3000, users: 1398 },
  { name: 'Mar', revenue: 2000, users: 9800 },
  { name: 'Apr', revenue: 2780, users: 3908 },
  { name: 'May', revenue: 1890, users: 4800 },
  { name: 'Jun', revenue: 2390, users: 3800 },
  { name: 'Jul', revenue: 3490, users: 4300 },
];

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalSalons: 0,
    pendingSalons: 0,
    totalUsers: 0,
    totalBookings: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [salonsRes, usersRes, bookingsRes] = await Promise.all([
        api.get('/salons'),
        api.get('/admin/users'),
        api.get('/bookings'),
      ]);

      const salons = salonsRes.data.data?.salons || [];
      const users = usersRes.data.data?.users || [];
      const bookings = bookingsRes.data.data?.bookings || [];

      // Add a slight delay for smoother visual transition
      setTimeout(() => {
        setStats({
          totalSalons: salons.length,
          pendingSalons: salons.filter((s) => !s.isApproved).length,
          totalUsers: users.length,
          totalBookings: bookings.length,
        });
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error fetching stats:', error);
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Salons',
      value: stats.totalSalons,
      icon: MdStore,
      color: 'from-blue-600 to-indigo-600',
      bgColor: 'bg-indigo-500/10',
      textColor: 'text-indigo-400',
    },
    {
      title: 'Pending Approval',
      value: stats.pendingSalons,
      icon: MdPending,
      color: 'from-gold-400 to-gold-600',
      bgColor: 'bg-gold-500/10',
      textColor: 'text-gold-400',
    },
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: MdPeople,
      color: 'from-emerald-500 to-teal-600',
      bgColor: 'bg-teal-500/10',
      textColor: 'text-teal-400',
    },
    {
      title: 'Total Bookings',
      value: stats.totalBookings,
      icon: MdCalendarToday,
      color: 'from-purple-600 to-fuchsia-600',
      bgColor: 'bg-fuchsia-500/10',
      textColor: 'text-fuchsia-400',
    },
  ];

  const quickActions = [
    {
      title: 'Manage Salons',
      description: 'Approve or reject salon registrations',
      icon: MdStore,
      link: '/salons',
      color: 'from-indigo-600/20 to-blue-600/20',
      hoverColor: 'group-hover:border-indigo-500/50',
    },
    {
      title: 'Manage Users',
      description: 'View and manage user accounts',
      icon: MdPeople,
      link: '/users',
      color: 'from-teal-600/20 to-emerald-600/20',
      hoverColor: 'group-hover:border-teal-500/50',
    },
    {
      title: 'View Bookings',
      description: 'Monitor all salon bookings',
      icon: MdCalendarToday,
      link: '/bookings',
      color: 'from-fuchsia-600/20 to-purple-600/20',
      hoverColor: 'group-hover:border-fuchsia-500/50',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 rounded-full border-t-2 border-gold-500 animate-spin"></div>
          <div className="absolute inset-2 rounded-full border-r-2 border-indigo-500 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-outfit font-bold text-white mb-2">
          Dashboard Overview
        </h1>
        <p className="text-gray-400 font-medium">Welcome back to your command center.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={index}
              className="glass-card rounded-2xl p-6 group cursor-pointer overflow-hidden relative"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`absolute -right-10 -top-10 w-32 h-32 rounded-full bg-gradient-to-br ${card.color} opacity-10 group-hover:scale-150 transition-transform duration-500`}></div>
              
              <div className="flex items-center justify-between mb-6 relative z-10">
                <div className={`w-14 h-14 rounded-2xl ${card.bgColor} border border-white/5 flex items-center justify-center group-hover:-translate-y-1 transition-transform duration-300 shadow-lg`}>
                  <Icon size={28} className={card.textColor} />
                </div>
                <MdTrendingUp size={24} className="text-gray-600 group-hover:text-green-400 transition-colors duration-300" />
              </div>
              
              <div className="relative z-10">
                <h3 className="text-gray-400 text-sm font-semibold tracking-wider uppercase mb-1">
                  {card.title}
                </h3>
                <div className="flex items-baseline space-x-2">
                  <p className="text-4xl font-outfit font-bold text-white tracking-tight">{card.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        {/* Main Chart */}
        <div className="lg:col-span-2 glass-card rounded-3xl p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-outfit font-bold text-white">Platform Growth</h2>
              <p className="text-gray-400 text-sm mt-1">Revenue vs Users over time</p>
            </div>
            <select className="bg-obsidian-900 border border-gray-700 text-white text-sm rounded-lg focus:ring-gold-500 focus:border-gold-500 block p-2.5 outline-none">
              <option>Last 7 months</option>
              <option>Last 30 days</option>
              <option>This Year</option>
            </select>
          </div>
          
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                <XAxis dataKey="name" stroke="#9CA3AF" tick={{fill: '#9CA3AF', fontSize: 12}} tickLine={false} axisLine={false} />
                <YAxis stroke="#9CA3AF" tick={{fill: '#9CA3AF', fontSize: 12}} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1a1a24', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="users" stroke="#4F46E5" strokeWidth={3} fillOpacity={1} fill="url(#colorUsers)" />
                <Area type="monotone" dataKey="revenue" stroke="#F59E0B" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Actions List */}
        <div className="glass-card rounded-3xl p-8 flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-outfit font-bold text-white">Quick Actions</h2>
            <MdCheckCircle size={24} className="text-gold-500" />
          </div>
          
          <div className="flex-1 flex flex-col justify-between space-y-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <a
                  key={index}
                  href={action.link}
                  className={`group p-5 bg-gradient-to-r ${action.color} rounded-2xl transition-all border border-transparent ${action.hoverColor} relative overflow-hidden flex items-center space-x-4`}
                >
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <Icon size={24} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-semibold text-lg">{action.title}</h3>
                    <p className="text-gray-400 text-xs mt-0.5">{action.description}</p>
                  </div>
                  <MdArrowForward size={20} className="text-gray-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
