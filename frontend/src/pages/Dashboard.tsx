import { useState, useEffect } from 'react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, LineChart, Line, Legend } from 'recharts';
import { Sparkles, Loader2, Server, AlertTriangle, Sliders } from 'lucide-react';
import { getForecast, getSystemHealth, getAnomalies, simulateScenario } from '../services/api';

const Dashboard = () => {
  const [loading, setLoading] = useState(false);
  const [serverStatus, setServerStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  
  const [forecastData, setForecastData] = useState<any[]>([]);
  const [horizon, setHorizon] = useState<number>(30);
  const [anomalies, setAnomalies] = useState<any[]>([]);

  const [simLoading, setSimLoading] = useState(false);
  const [marketingBoost, setMarketingBoost] = useState<number>(0);
  const [discount, setDiscount] = useState<number>(0);
  const [scenarioData, setScenarioData] = useState<any[]>([]);
  const [scenarioSummary, setScenarioSummary] = useState<any>(null);

  useEffect(() => {
    getSystemHealth().then(() => setServerStatus('online')).catch(() => setServerStatus('offline'));
    fetchAnomalies();
  }, []);

  const fetchAnomalies = async () => {
    try {
      const res = await getAnomalies();
      setAnomalies(res.data.slice(0, 5));
    } catch (e) { console.error(e); }
  };

  const handleGenerateForecast = async () => {
    setLoading(true);
    try {
      const response = await getForecast(horizon);
      setForecastData(response.predictions);
    } finally { setLoading(false); }
  };

  const handleSimulate = async () => {
    setSimLoading(true);
    try {
      const response = await simulateScenario(30, marketingBoost, discount);
      setScenarioData(response.daily_simulation);
      setScenarioSummary(response.scenario_summary);
    } finally { setSimLoading(false); }
  };

  return (
    <div className="space-y-6 pb-10 max-w-full">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-white">Business Overview</h1>
            <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium border shrink-0 ${serverStatus === 'online' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
              <Server size={12} /> {serverStatus === 'online' ? 'API Online' : 'API Offline'}
            </div>
          </div>
          <p className="text-brand-muted text-sm mt-1">AI-Powered Sales Intelligence & Planning</p>
        </div>
      </div>

      {/* BASELINE FORECAST SECTION */}
      <div className="bg-brand-card p-4 md:p-6 rounded-xl border border-slate-800 overflow-hidden w-full">
        <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h2 className="text-lg font-bold text-white">Baseline AI Forecast</h2>
            <p className="text-brand-muted text-sm">Standard revenue prediction based on historical trends.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <select value={horizon} onChange={(e) => setHorizon(Number(e.target.value))} className="flex-1 sm:flex-none bg-slate-800 border border-slate-700 text-white text-sm rounded-lg p-2.5 outline-none">
              <option value={7}>7 Days</option>
              <option value={30}>30 Days</option>
              <option value={90}>90 Days</option>
            </select>
            <button onClick={handleGenerateForecast} disabled={loading} className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-brand-accent hover:bg-blue-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-all">
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />} Generate
            </button>
          </div>
        </div>
        
        <div className="h-[250px] md:h-[300px] w-full min-w-0">
          {forecastData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={forecastData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="date" stroke="#94a3b8" tick={{fontSize: 11}} tickFormatter={(v) => v.substring(5)} axisLine={false} tickLine={false} />
                <YAxis stroke="#94a3b8" tick={{fontSize: 11}} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v/1000000).toFixed(1)}M`} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f8fafc' }} formatter={(val: any) => [`₹${Number(val).toLocaleString()}`, "Revenue"]} />
                <Area type="monotone" dataKey="predicted_revenue" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-brand-muted border border-dashed border-slate-700 rounded-lg text-center px-4">Click Generate to view forecast</div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* WHAT-IF SIMULATOR */}
        <div className="lg:col-span-2 bg-brand-card p-4 md:p-6 rounded-xl border border-slate-800 overflow-hidden w-full">
          <div className="flex items-center gap-2 mb-6">
            <Sliders size={20} className="text-purple-400 shrink-0" />
            <h2 className="text-lg font-bold text-white">What-If Scenario Simulator</h2>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 md:gap-6 mb-6 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
            <div className="flex-1">
              <label className="text-sm font-medium text-brand-muted block mb-2">Marketing Boost: +{marketingBoost}%</label>
              <input type="range" min="0" max="50" value={marketingBoost} onChange={(e) => setMarketingBoost(Number(e.target.value))} className="w-full accent-purple-500" />
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium text-brand-muted block mb-2">Price Discount: {discount}%</label>
              <input type="range" min="0" max="30" value={discount} onChange={(e) => setDiscount(Number(e.target.value))} className="w-full accent-green-500" />
            </div>
            <button onClick={handleSimulate} disabled={simLoading} className="w-full md:w-auto bg-purple-600 hover:bg-purple-500 text-white px-6 py-2 rounded-lg font-medium self-end transition-all">
              {simLoading ? 'Running...' : 'Simulate'}
            </button>
          </div>

          <div className="h-[250px] w-full min-w-0">
            {scenarioData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={scenarioData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="date" stroke="#94a3b8" tick={{fontSize: 11}} tickFormatter={(v) => v.substring(5)} axisLine={false} tickLine={false} />
                  <YAxis stroke="#94a3b8" tick={{fontSize: 11}} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v/1000000).toFixed(1)}M`} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b' }} />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Line type="monotone" dataKey="baseline_revenue" name="Baseline" stroke="#94a3b8" strokeDasharray="5 5" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="simulated_revenue" name="Simulated" stroke="#a855f7" strokeWidth={3} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-brand-muted text-center px-4">Adjust sliders and run simulation.</div>
            )}
          </div>
          
          {scenarioSummary && (
            <div className="mt-4 p-3 bg-slate-800 rounded-lg flex flex-wrap justify-between items-center text-sm gap-2">
              <span className="text-brand-muted">Net Projected Impact:</span>
              <span className={`font-bold text-lg ${scenarioSummary.net_impact >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {scenarioSummary.net_impact >= 0 ? '+' : ''}₹{Number(scenarioSummary.net_impact).toLocaleString()}
              </span>
            </div>
          )}
        </div>

        {/* AI ANOMALY ALERTS */}
        <div className="bg-brand-card p-4 md:p-6 rounded-xl border border-slate-800 overflow-hidden w-full">
          <div className="flex items-center gap-2 mb-6">
            <AlertTriangle size={20} className="text-orange-400 shrink-0" />
            <h2 className="text-lg font-bold text-white">AI Outlier Alerts</h2>
          </div>
          
          <div className="space-y-4 h-[350px] overflow-y-auto pr-2 custom-scrollbar">
            {anomalies.length > 0 ? anomalies.map((anomaly, idx) => (
              <div key={idx} className="p-3 border border-slate-700 bg-slate-800/30 rounded-lg flex flex-col gap-2 hover:bg-slate-800/80 transition-colors">
                <div className="flex justify-between items-start">
                  <span className={`text-xs font-bold px-2 py-1 rounded-md ${
                    anomaly.severity.includes('Critical') ? 'bg-red-500/20 text-red-400' :
                    anomaly.severity.includes('Major') ? 'bg-orange-500/20 text-orange-400' : 'bg-blue-500/20 text-blue-400'
                  }`}>
                    {anomaly.severity}
                  </span>
                  <span className="text-xs text-brand-muted">{anomaly.date}</span>
                </div>
                <div className="flex flex-wrap justify-between items-center mt-1 gap-2">
                  <span className="text-sm text-white font-medium">{anomaly.type}</span>
                  <span className="text-sm font-bold text-slate-300">₹{(anomaly.revenue / 100000).toFixed(2)}L</span>
                </div>
              </div>
            )) : (
              <div className="text-center text-brand-muted text-sm mt-10">No recent anomalies detected. System is stable.</div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;