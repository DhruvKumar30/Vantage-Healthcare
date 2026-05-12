import { useAuth } from '../context/AuthContext';
import { NavLink } from 'react-router-dom';
import { useHospital } from '../context/HospitalContext';
import HospitalSelector from './HospitalSelector';

const navItems = [
  { path: '/dashboard',  label: 'Daily Snapshot' },
  { path: '/weekly',     label: 'Weekly Trends' },
  { path: '/monthly',    label: 'Monthly Trends' },
  { path: '/benchmarks', label: 'Benchmarks' },
  { path: '/staffing',   label: 'Staffing' },
  { path: '/quality',    label: 'Patient Care Quality' },
  { path: '/outcomes',   label: 'Treatment Outcomes' },
  { path: '/flow',       label: 'Patient Flow' },
  { path: '/alerts',     label: 'Alerts Config' },
];

export default function Sidebar() {
  const { selectedHospital } = useHospital();
  const { user, logout } = useAuth();
  return (
    <aside style={{ width: 260, background: '#f8f9fa', borderRight: '1px solid #e0e0e0', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '20px 16px', borderBottom: '1px solid #e0e0e0' }}>
        <div style={{ fontWeight: 700, fontSize: 18, color: '#1a1a2e' }}>Vantage Healthcare</div>
        <div style={{ fontSize: 12, color: '#666', marginTop: 2 }}>Cancer Immunology Dashboard</div>
      </div>

      <div style={{ borderBottom: '1px solid #e0e0e0', paddingBottom: 8 }}>
        <div style={{ padding: '10px 16px', fontSize: 11, fontWeight: 700, color: '#999', textTransform: 'uppercase' }}>
          Select Hospital
        </div>
        <HospitalSelector />
      </div>

      <nav style={{ flex: 1, padding: '8px 0' }}>
        <div style={{ padding: '10px 16px', fontSize: 11, fontWeight: 700, color: '#999', textTransform: 'uppercase' }}>
          Views
        </div>
        {navItems.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            style={({ isActive }) => ({
              display: 'block',
              padding: '9px 20px',
              textDecoration: 'none',
              fontSize: 14,
              color: isActive ? selectedHospital.color : '#333',
              fontWeight: isActive ? 600 : 400,
              background: isActive ? `${selectedHospital.color}15` : 'transparent',
            })}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div style={{ padding: '12px 16px', borderTop: '1px solid #e0e0e0' }}>
        <div style={{ fontSize: 12, color: '#999', marginBottom: 6 }}>{user.email}</div>
        <button onClick={logout} style={{
          width: '100%', padding: '8px 0', background: '#f1f3f5', border: '1px solid #ddd',
          borderRadius: 6, fontSize: 13, color: '#555', cursor: 'pointer', fontWeight: 500,
        }}>
          Sign Out
        </button>
      </div>

    </aside>
  );
}