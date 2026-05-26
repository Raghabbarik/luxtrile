import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  MdDashboard, 
  MdStore, 
  MdPeople, 
  MdCalendarToday, 
  MdBarChart,
  MdLogout,
  MdMenu,
  MdClose
} from 'react-icons/md';
import { useState } from 'react';

export default function Layout({ children, setIsAuthenticated }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const menuItems = [
    { path: '/', icon: MdDashboard, label: 'Dashboard' },
    { path: '/salons', icon: MdStore, label: 'Salons' },
    { path: '/users', icon: MdPeople, label: 'Users' },
    { path: '/performance', icon: MdBarChart, label: 'Performance' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    setIsAuthenticated(false);
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-gray-800/50 backdrop-blur-xl border-r border-gray-700/50 flex flex-col transition-all duration-300 relative`}>
        {/* Toggle Button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute -right-3 top-8 bg-gold-500 text-white p-1.5 rounded-full shadow-lg hover:bg-gold-600 transition-colors z-10"
        >
          {sidebarOpen ? <MdClose size={16} /> : <MdMenu size={16} />}
        </button>

        <div className="p-6 border-b border-gray-700/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-gold-400 to-gold-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">L</span>
            </div>
            {sidebarOpen && (
              <div>
                <h1 className="text-xl font-bold text-white">
                  Lustril<span className="text-gold-500">.</span>
                </h1>
                <p className="text-xs text-gray-400">Admin Panel</p>
              </div>
            )}
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center ${sidebarOpen ? 'space-x-3 px-4' : 'justify-center px-2'} py-3 rounded-xl transition-all group relative ${
                  isActive
                    ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-white shadow-lg shadow-gold-500/20'
                    : 'text-gray-300 hover:bg-gray-700/50'
                }`}
              >
                <Icon size={24} className={isActive ? 'text-white' : 'text-gray-400 group-hover:text-gold-500'} />
                {sidebarOpen && <span className="font-medium">{item.label}</span>}
                {!sidebarOpen && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    {item.label}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-700/50">
          <button
            onClick={handleLogout}
            className={`w-full flex items-center ${sidebarOpen ? 'space-x-3 px-4' : 'justify-center px-2'} py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all group`}
          >
            <MdLogout size={24} className="group-hover:text-red-500" />
            {sidebarOpen && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
