import { useState, useEffect } from 'react';
import { useHospital } from '../context/HospitalContext';
import { fetchData } from '../api/apiService';

const card = { background: '#fff', borderRadius: 10, boxShadow: '0 2px 10px rgba(0,0,0,0.07)', padding: '20px 24px' };

export default function AlertsConfig() {
  const { selectedHospital } = useHospital();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true); setRows([]);
    fetchData('alerts', selectedHospital.id)
      .then(data => { setRows(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [selectedHospital.id]);

  if (loading) return <div style={{ padding: 40 }}>Loading…</div>;
  if (!rows.length) return <div>No data.</div>;

  const criticals = rows.filter(r => r['Severity'] === 'Critical');
  const warnings = rows.filter(r => r['Severity'] === 'Warning');

  const AlertCard = ({ row }) => {
    const isCritical = row['Severity'] === 'Critical';
    return (
      <div style={{ ...card, borderLeft: `4px solid ${isCritical ? '#C62828' : '#f57f17'}`, padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontWeight: 600, fontSize: 14 }}>{row['Metric Name']}</div>
          <div style={{ fontSize: 13, color: '#888', marginTop: 3 }}>
            Threshold: {row['Max Threshold']}{row['Metric Name'].includes('%') || row['Metric Name'].includes('Score') ? '' : ''}
          </div>
        </div>
        <span style={{
          background: isCritical ? '#fdecea' : '#fff8e1',
          color: isCritical ? '#C62828' : '#f57f17',
          fontWeight: 700, fontSize: 13,
          padding: '5px 14px', borderRadius: 20,
        }}>
          {row['Severity']}
        </span>
      </div>
    );
  };

  return (
    <div>
      <h2 style={{ marginBottom: 24, color: '#1a1a2e' }}>{selectedHospital.name} — Alerts Config</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
        <div style={{ ...card, borderTop: '4px solid #C62828', textAlign: 'center' }}>
          <div style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>Critical Alerts</div>
          <div style={{ fontSize: 36, fontWeight: 700, color: '#C62828' }}>{criticals.length}</div>
        </div>
        <div style={{ ...card, borderTop: '4px solid #f57f17', textAlign: 'center' }}>
          <div style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>Warning Alerts</div>
          <div style={{ fontSize: 36, fontWeight: 700, color: '#f57f17' }}>{warnings.length}</div>
        </div>
      </div>
      {criticals.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: '#C62828', marginBottom: 12 }}>🔴 Critical Thresholds</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {criticals.map((row, i) => <AlertCard key={i} row={row} />)}
          </div>
        </div>
      )}
      {warnings.length > 0 && (
        <div>
          <div style={{ fontWeight: 700, fontSize: 15, color: '#f57f17', marginBottom: 12 }}>🟡 Warning Thresholds</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {warnings.map((row, i) => <AlertCard key={i} row={row} />)}
          </div>
        </div>
      )}
    </div>
  );
}