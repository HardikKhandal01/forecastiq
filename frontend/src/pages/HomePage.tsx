import { BarChart3, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();
  return (
    <div className="h-screen bg-brand-dark flex flex-col items-center justify-center text-center p-6">
      <BarChart3 size={64} className="text-brand-accent mb-6" />
      <h1 className="text-5xl font-bold text-white mb-4">ForecastIQ Intelligence</h1>
      <p className="text-brand-muted text-xl max-w-2xl mb-8">Empowering business leaders with enterprise-grade predictive analytics and automated sales forecasting.</p>
      <button 
        onClick={() => navigate('/dashboard')} 
        className="flex items-center gap-2 bg-brand-accent hover:bg-blue-600 px-8 py-3 rounded-xl font-bold text-lg transition-all"
      >
        Access Analytics Dashboard <ArrowRight size={20} />
      </button>
    </div>
  );
};
export default HomePage;