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
    <div className="min-h-screen bg-obsidian-950 font-inter flex relative overflow-hidden text-gray-100">
      {/* Animated Mesh Gradient Background */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-gold-600/30 blur-[120px] animate-pulse-slow"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/20 blur-[120px] animate-pulse-slow" style={{ animationDelay: '1.5s' }}></div>
      </div>

      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} glass-panel flex flex-col transition-all duration-300 relative z-20`}>
        {/* Toggle Button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute -right-3 top-8 bg-gradient-to-r from-gold-400 to-gold-600 text-obsidian-950 p-1.5 rounded-full shadow-[0_0_15px_rgba(245,158,11,0.5)] hover:scale-110 transition-transform z-30"
        >
          {sidebarOpen ? <MdClose size={18} /> : <MdMenu size={18} />}
        </button>

        <div className="p-6 border-b border-white/5">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-gold-400 to-gold-600 rounded-xl flex items-center justify-center shadow-lg shadow-gold-500/30">
              <span className="text-obsidian-950 font-outfit font-black text-xl">L</span>
            </div>
            {sidebarOpen && (
              <div className="animate-fade-in">
                <h1 className="text-xl font-outfit font-bold text-white tracking-wide">
                  Lustril<span className="text-gold-400">.</span>
                </h1>
                <p className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold">Admin Panel</p>
              </div>
            )}
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 mt-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center ${sidebarOpen ? 'space-x-3 px-4' : 'justify-center px-2'} py-3.5 rounded-xl transition-all duration-300 group relative overflow-hidden ${
                  isActive
                    ? 'bg-white/10 border border-white/10 shadow-[0_0_20px_rgba(255,255,255,0.05)]'
                    : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
                }`}
              >
                {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-gold-400 to-gold-600 shadow-[0_0_10px_rgba(245,158,11,0.8)]"></div>}
                
                <Icon size={22} className={`relative z-10 transition-colors ${isActive ? 'text-gold-400' : 'group-hover:text-gold-300'}`} />
                
                {sidebarOpen && <span className={`relative z-10 font-medium ${isActive ? 'text-white' : ''}`}>{item.label}</span>}
                
                {!sidebarOpen && (
                  <div className="absolute left-full ml-4 px-3 py-1.5 glass-panel text-white text-xs font-semibold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                    {item.label}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/5 mb-4">
          <button
            onClick={handleLogout}
            className={`w-full flex items-center ${sidebarOpen ? 'space-x-3 px-4' : 'justify-center px-2'} py-3.5 rounded-xl text-red-400/80 hover:bg-red-500/10 hover:text-red-400 transition-all duration-300 group`}
          >
            <MdLogout size={22} className="group-hover:scale-110 transition-transform" />
            {sidebarOpen && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative z-10">
        {/* Top Navbar */}
        <header className="h-20 glass-panel border-x-0 border-t-0 flex items-center justify-between px-8 shrink-0">
          <div className="text-gray-300 font-medium text-sm">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
          <div className="flex items-center space-x-6">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-gray-700 to-gray-600 border-2 border-gold-500/50 p-0.5 cursor-pointer hover:border-gold-400 transition-colors">
              <img src="https://ui-avatars.com/api/?name=Admin&background=random" alt="Admin" className="w-full h-full rounded-full" />
            </div>
          </div>
        </header>

        {/* Scrollable Page Content */}
        <div className="flex-1 overflow-y-auto p-8 scroll-smooth">
          <div className="max-w-7xl mx-auto animate-float" style={{ animationDuration: '8s' }}>
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
