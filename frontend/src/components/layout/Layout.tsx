import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, TrendingUp, Settings, Bell, Search, BarChart3, Menu, X } from 'lucide-react';

const Layout = () => {
  const location = useLocation();
  // Mobile sidebar toggle state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="flex h-screen bg-brand-dark text-brand-text font-sans overflow-hidden">
      
      {/* MOBILE OVERLAY BACKGROUND (Black shadow when sidebar is open) */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 md:hidden transition-opacity"
          onClick={closeSidebar}
        />
      )}

      {/* 1. SIDEBAR (Mobile Slide-out & Desktop Fixed) */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-brand-card border-r border-slate-800 flex flex-col transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800 shrink-0">
          <Link to="/" onClick={closeSidebar} className="flex items-center gap-2 text-brand-accent hover:text-blue-400 font-bold text-xl tracking-wide transition-colors">
            <BarChart3 size={24} />
            <span>ForecastIQ</span>
          </Link>
          {/* Close Icon for Mobile */}
          <button onClick={closeSidebar} className="md:hidden text-brand-muted hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>
        
        <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto custom-scrollbar">
          <Link 
            to="/dashboard" 
            onClick={closeSidebar}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              location.pathname === '/dashboard' 
                ? 'bg-brand-accent/10 text-brand-accent font-medium' 
                : 'text-brand-muted hover:bg-slate-800 hover:text-brand-text'
            }`}
          >
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </Link>

          <button className="w-full flex items-center gap-3 px-4 py-3 text-brand-muted hover:bg-slate-800 hover:text-brand-text rounded-lg transition-colors cursor-not-allowed opacity-70">
            <TrendingUp size={20} />
            <span>AI Forecast</span>
          </button>

          <button className="w-full flex items-center gap-3 px-4 py-3 text-brand-muted hover:bg-slate-800 hover:text-brand-text rounded-lg transition-colors cursor-not-allowed opacity-70">
            <Settings size={20} />
            <span>Settings</span>
          </button>
        </nav>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      {/* min-w-0 fix karta hai Recharts ka screen se bahar jane wala issue */}
      <main className="flex-1 flex flex-col h-full relative min-w-0">
        
        {/* HEADER (Top Bar) */}
        <header className="h-16 bg-brand-card/50 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-4 md:px-6 sticky top-0 z-10 shrink-0">
          
          <div className="flex items-center gap-4">
            {/* HAMBURGER ICON (Visible only on mobile) */}
            <button onClick={toggleSidebar} className="md:hidden p-1 text-brand-muted hover:text-white transition-colors">
              <Menu size={26} />
            </button>
            
            {/* Search Bar - Hidden on small screens to save space */}
            <div className="hidden md:flex items-center gap-2 bg-slate-800/50 px-4 py-2 rounded-full border border-slate-700 w-72 lg:w-96 transition-all focus-within:border-brand-accent focus-within:ring-1 focus-within:ring-brand-accent">
              <Search size={18} className="text-brand-muted" />
              <input 
                type="text" 
                placeholder="Search reports..." 
                className="bg-transparent border-none outline-none text-sm w-full text-brand-text placeholder-brand-muted"
              />
            </div>
          </div>
          
          {/* User Profile & Notifications */}
          <div className="flex items-center gap-3 md:gap-5">
            <button className="p-2 text-brand-muted hover:text-brand-text transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-brand-card animate-pulse"></span>
            </button>
            
            <div className="flex items-center gap-3 border-l border-slate-700 pl-3 md:pl-5">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-white leading-tight">John Doe</p>
                <p className="text-xs text-brand-muted">Director</p>
              </div>
              <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-gradient-to-tr from-brand-accent to-purple-500 flex items-center justify-center text-sm font-bold text-white shadow-lg shrink-0">
                JD
              </div>
            </div>
          </div>
        </header>

        {/* DYNAMIC PAGES (Dashboard) */}
        <div className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6 custom-scrollbar">
          <Outlet />
        </div>
      </main>
      
    </div>
  );
};

export default Layout;