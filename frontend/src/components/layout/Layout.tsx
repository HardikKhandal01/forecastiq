import { useState, useRef } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, TrendingUp, Settings, Bell, Search, BarChart3, Menu, X, UploadCloud, FileText, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { uploadDataset } from '../../services/api';

const Layout = () => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Upload States
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const [uploadError, setUploadError] = useState('');

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    setUploadError('');
    setIsUploading(true);
    
    try {
      setUploadStatus('Uploading & verifying dataset limit...');
      
      // Artificial delay for premium UX feel
      await new Promise(r => setTimeout(r, 1000));
      setUploadStatus('AI analyzing columns & retraining XGBoost...');
      
      // Actual API Call
      const response = await uploadDataset(file);
      
      setUploadStatus(`Success! Detected metric: ${response.detected_target}`);
      
      // Tell the Dashboard to refresh its data and graphs!
      window.dispatchEvent(new CustomEvent('data-updated', { 
        detail: { targetName: response.detected_target } 
      }));

      setTimeout(() => {
        setIsUploading(false);
        setIsUploadModalOpen(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }, 2000);

    } catch (error: any) {
      setIsUploading(false);
      setUploadError(error.response?.data?.detail || 'Failed to process dataset. Please ensure it is a valid CSV.');
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex h-screen bg-brand-dark text-brand-text font-sans overflow-hidden">
      
      {/* MOBILE OVERLAY */}
      {isSidebarOpen && <div className="fixed inset-0 bg-black/60 z-40 md:hidden" onClick={closeSidebar} />}

      {/* UPLOAD INSTRUCTION MODAL */}
      {isUploadModalOpen && !isUploading && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
          <div className="bg-brand-card border border-slate-700 p-6 sm:p-8 rounded-2xl shadow-2xl w-full max-w-md relative">
            <button onClick={() => setIsUploadModalOpen(false)} className="absolute top-4 right-4 text-brand-muted hover:text-white">
              <X size={20} />
            </button>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><UploadCloud className="text-brand-accent"/> Import Custom Data</h2>
            
            <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700 mb-6 space-y-3 text-sm text-brand-muted">
              <p className="flex items-start gap-2"><CheckCircle2 size={16} className="text-green-400 mt-0.5 shrink-0"/> <b>Format:</b> Only .csv files are supported.</p>
              <p className="flex items-start gap-2"><AlertCircle size={16} className="text-orange-400 mt-0.5 shrink-0"/> <b>Size Limit:</b> Max 5MB (Approx 50,000 rows) to ensure free server stability.</p>
              <p className="flex items-start gap-2"><FileText size={16} className="text-blue-400 mt-0.5 shrink-0"/> <b>Columns:</b> Must contain at least 1 Date column and 1 Numeric column (e.g., Sales, Users, Traffic).</p>
            </div>

            {uploadError && <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 text-red-400 text-sm rounded-lg text-center">{uploadError}</div>}

            <button onClick={() => fileInputRef.current?.click()} className="w-full bg-brand-accent hover:bg-blue-600 text-white font-bold py-3 rounded-xl transition-all">
              Select .csv File
            </button>
            <input type="file" ref={fileInputRef} className="hidden" accept=".csv" onChange={handleFileUpload} />
          </div>
        </div>
      )}

      {/* UPLOADING PROGRESS MODAL */}
      {isUploading && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
          <div className="bg-brand-card border border-slate-700 p-6 sm:p-8 rounded-2xl shadow-2xl flex flex-col items-center max-w-sm w-full text-center">
            {uploadStatus.includes('Success') ? (
              <CheckCircle2 size={50} className="text-green-500 mb-4 animate-bounce" />
            ) : (
              <div className="relative mb-4">
                <Loader2 size={50} className="text-brand-accent animate-spin" />
                <FileText size={20} className="text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              </div>
            )}
            <h3 className="text-lg font-bold text-white mb-2">Data Ingestion Pipeline</h3>
            <p className="text-sm text-brand-muted">{uploadStatus}</p>
          </div>
        </div>
      )}

      {/* SIDEBAR */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-brand-card border-r border-slate-800 flex flex-col transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800 shrink-0">
          <Link to="/" onClick={closeSidebar} className="flex items-center gap-2 text-brand-accent hover:text-blue-400 font-bold text-xl tracking-wide transition-colors">
            <BarChart3 size={24} /> <span>ForecastIQ</span>
          </Link>
          <button onClick={closeSidebar} className="md:hidden text-brand-muted hover:text-white transition-colors"><X size={24} /></button>
        </div>
        <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto custom-scrollbar">
          <Link to="/dashboard" onClick={closeSidebar} className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${location.pathname === '/dashboard' ? 'bg-brand-accent/10 text-brand-accent font-medium' : 'text-brand-muted hover:bg-slate-800 hover:text-brand-text'}`}>
            <LayoutDashboard size={20} /> <span>Dashboard</span>
          </Link>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-brand-muted hover:bg-slate-800 hover:text-brand-text rounded-lg transition-colors cursor-not-allowed opacity-70"><TrendingUp size={20} /> <span>AI Forecast</span></button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-brand-muted hover:bg-slate-800 hover:text-brand-text rounded-lg transition-colors cursor-not-allowed opacity-70"><Settings size={20} /> <span>Settings</span></button>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col h-full relative min-w-0">
        <header className="h-16 bg-brand-card/50 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-4 md:px-6 sticky top-0 z-10 shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={toggleSidebar} className="md:hidden p-1 text-brand-muted hover:text-white transition-colors"><Menu size={26} /></button>
            <div className="hidden md:flex items-center gap-2 bg-slate-800/50 px-4 py-2 rounded-full border border-slate-700 w-72 lg:w-96 transition-all focus-within:border-brand-accent focus-within:ring-1 focus-within:ring-brand-accent">
              <Search size={18} className="text-brand-muted" />
              <input type="text" placeholder="Search reports..." className="bg-transparent border-none outline-none text-sm w-full text-brand-text placeholder-brand-muted" />
            </div>
          </div>
          
          <div className="flex items-center gap-3 md:gap-5">
            <button onClick={() => setIsUploadModalOpen(true)} className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-brand-accent/10 text-brand-accent hover:bg-brand-accent/20 border border-brand-accent/20 rounded-lg transition-colors text-sm font-medium">
              <UploadCloud size={18} /> <span className="hidden sm:inline">Import Data</span>
            </button>
            <button className="p-2 text-brand-muted hover:text-brand-text transition-colors relative hidden sm:block">
              <Bell size={20} /> <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-brand-card animate-pulse"></span>
            </button>
            <div className="flex items-center gap-3 border-l border-slate-700 pl-3 md:pl-5">
              <div className="text-right hidden sm:block"><p className="text-sm font-medium text-white leading-tight">John Doe</p><p className="text-xs text-brand-muted">Director</p></div>
              <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-gradient-to-tr from-brand-accent to-purple-500 flex items-center justify-center text-sm font-bold text-white shadow-lg shrink-0">JD</div>
            </div>
          </div>
        </header>
        <div className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6 custom-scrollbar">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;