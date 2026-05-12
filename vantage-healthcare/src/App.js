import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { HospitalProvider } from './context/HospitalContext';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import WeeklyTrends from './pages/WeeklyTrends';
import MonthlyTrends from './pages/MonthlyTrends';
import Benchmarks from './pages/Benchmarks';
import Staffing from './pages/Staffing';
import PatientCareQuality from './pages/PatientCareQuality';
import TreatmentOutcomes from './pages/TreatmentOutcomes';
import PatientFlow from './pages/PatientFlow';
import AlertsConfig from './pages/AlertsConfig';

function AppContent() {
  const { user } = useAuth();
  if (!user) return <Login />;

  return (
    <HospitalProvider hospitalAccess={user.hospitalAccess}>
      <BrowserRouter>
        <div style={{ display: 'flex', height: '100vh' }}>
          <Sidebar />
          <main style={{ flex: 1, overflow: 'auto', padding: '24px' }}>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard"  element={<Dashboard />} />
              <Route path="/weekly"     element={<WeeklyTrends />} />
              <Route path="/monthly"    element={<MonthlyTrends />} />
              <Route path="/benchmarks" element={<Benchmarks />} />
              <Route path="/staffing"   element={<Staffing />} />
              <Route path="/quality"    element={<PatientCareQuality />} />
              <Route path="/outcomes"   element={<TreatmentOutcomes />} />
              <Route path="/flow"       element={<PatientFlow />} />
              <Route path="/alerts"     element={<AlertsConfig />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </HospitalProvider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}