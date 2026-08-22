import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard.tsx';
import HomePage from './pages/HomePage.tsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<Layout />}>
          <Route index element={<Dashboard />} />
          {/* Aage chalkar hum yahan aur pages (Anomalies, Settings) add karenge */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;