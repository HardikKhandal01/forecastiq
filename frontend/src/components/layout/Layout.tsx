import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, TrendingUp, Settings, Bell, Search, BarChart3 } from 'lucide-react';

const Layout = () => {
  const location = useLocation(); // Current path pata karne ke liye

  return (
    <div className="flex h-screen bg-brand-dark text-brand-text font-sans overflow-hidden">
      
      {/* 1. SIDEBAR */}
      <aside className="w-64 bg-brand-card border-r border-slate-800 hidden md:flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          {/* LOGO - Ab ye clickable hai aur Home Page (/) par le jayega */}
          <Link to="/" className="flex items-center gap-2 text-brand-accent hover:text-blue-400 font-bold text-xl tracking-wide transition-colors">
            <BarChart3 size={24} />
            <span>ForecastIQ</span>
          </Link>
        </div>
        
        <nav className="flex-1 py-6 px-4 space-y-2">
          {/* Dashboard Link */}
          <Link 
            to="/dashboard" 
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              location.pathname === '/dashboard' 
                ? 'bg-brand-accent/10 text-brand-accent font-medium' 
                : 'text-brand-muted hover:bg-slate-800 hover:text-brand-text'
            }`}
          >
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </Link>

          {/* AI Forecast / Predictive Analytics Link (Currently placeholder) */}
          <button 
            className="w-full flex items-center gap-3 px-4 py-3 text-brand-muted hover:bg-slate-800 hover:text-brand-text rounded-lg transition-colors cursor-not-allowed opacity-70"
            title="Feature in discussion"
          >
            <TrendingUp size={20} />
            <span>AI Forecast</span>
          </button>

          {/* Settings Link (Currently placeholder) */}
          <button 
            className="w-full flex items-center gap-3 px-4 py-3 text-brand-muted hover:bg-slate-800 hover:text-brand-text rounded-lg transition-colors cursor-not-allowed opacity-70"
          >
            <Settings size={20} />
            <span>Settings</span>
          </button>
        </nav>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col h-full relative">
        
        {/* HEADER (Top Bar) */}
        <header className="h-16 bg-brand-card/50 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-6 sticky top-0 z-10">
          
          {/* Search Bar - Future feature for semantic search */}
          <div className="flex items-center gap-2 bg-slate-800/50 px-4 py-2 rounded-full border border-slate-700 w-96 transition-all focus-within:border-brand-accent focus-within:ring-1 focus-within:ring-brand-accent">
            <Search size={18} className="text-brand-muted" />
            <input 
              type="text" 
              placeholder="Search reports (e.g., 'Last week revenue')..." 
              className="bg-transparent border-none outline-none text-sm w-full text-brand-text placeholder-brand-muted"
            />
          </div>
          
          {/* User Profile & Notifications */}
          <div className="flex items-center gap-5">
            {/* Notification Bell */}
            <button className="p-2 text-brand-muted hover:text-brand-text transition-colors relative">
              <Bell size={20} />
              {/* Red Dot for active notifications */}
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-brand-card animate-pulse"></span>
            </button>
            
            {/* User Profile Section */}
            <div className="flex items-center gap-3 border-l border-slate-700 pl-5">
              <div className="text-right hidden md:block">
                <p className="text-sm font-medium text-white leading-tight">John Doe</p>
                <p className="text-xs text-brand-muted">Director of Sales</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-brand-accent to-purple-500 flex items-center justify-center text-sm font-bold text-white shadow-lg cursor-pointer hover:shadow-brand-accent/20 transition-all">
                JD
              </div>
            </div>
          </div>
        </header>

        {/* DYNAMIC PAGES (Dashboard) WILL RENDER HERE */}
        <div className="flex-1 overflow-auto p-6 custom-scrollbar">
          <Outlet />
        </div>
      </main>
      
    </div>
  );
};

export default Layout;