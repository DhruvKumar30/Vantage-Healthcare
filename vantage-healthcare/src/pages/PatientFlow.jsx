import { useState, useEffect } from 'react';
import { useHospital } from '../context/HospitalContext';
import { fetchData } from '../api/apiService';

const card = { background: '#fff', borderRadius: 10, boxShadow: '0 2px 10px rgba(0,0,0,0.07)', padding: '20px 24px' };

const statusConfig = {
  'Receiving Infusion': { bg: '#e3f2fd', color: '#1565C0', dot: '#1565C0' },
  'Waiting':            { bg: '#fff8e1', color: '#f57f17', dot: '#f57f17' },
  'In Consultation':    { bg: '#f3e5f5', color: '#7B1FA2', dot: '#7B1FA2' },
  'Discharged':         { bg: '#e8f5e9', color: '#2e7d32', dot: '#2e7d32' },
  'Monitoring (Post-Infusion)': { bg: '#e0f7fa', color: '#00838f', dot: '#00838f' },
};

export default function PatientFlow() {
  const { selectedHospital } = useHospital();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true); setRows([]);
    fetchData('flow', selectedHospital.id)
      .then(data => { setRows(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [selectedHospital.id]);

  if (loading) return <div style={{ padding: 40 }}>Loading…</div>;
  if (!rows.length) return <div>No data.</div>;

  const statusCounts = rows.reduce((acc, r) => {
    acc[r['Status']] = (acc[r['Status']] || 0) + 1;
    return acc;
  }, {});

  return (
    <div>
      <h2 style={{ marginBottom: 24, color: '#1a1a2e' }}>{selectedHospital.name} — Patient Flow</h2>
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        {Object.entries(statusCounts).map(([status, count]) => {
          const cfg = statusConfig[status] || { bg: '#f5f5f5', color: '#555', dot: '#555' };
          return (
            <div key={status} style={{ ...card, borderTop: `4px solid ${cfg.dot}`, padding: '14px 20px', minWidth: 140 }}>
              <div style={{ fontSize: 13, color: '#888', marginBottom: 6 }}>{status}</div>
              <div style={{ fontSize: 28, fontWeight: 700, color: cfg.dot }}>{count}</div>
            </div>
          );
        })}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 14 }}>
        {rows.map((row, i) => {
          const cfg = statusConfig[row['Status']] || { bg: '#f5f5f5', color: '#555', dot: '#555' };
          return (
            <div key={i} style={{ ...card, padding: '16px 20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>{row['Patient ID']}</div>
                  <div style={{ fontSize: 13, color: '#666', marginTop: 2 }}>{row['Condition Type']}</div>
                </div>
                <span style={{ background: cfg.bg, color: cfg.color, fontSize: 12, padding: '4px 12px', borderRadius: 20, fontWeight: 600, whiteSpace: 'nowrap' }}>
                  {row['Status']}
                </span>
              </div>
              <div style={{ display: 'flex', gap: 16, fontSize: 13, color: '#666' }}>
                <span>📍 {row['Room/Bed Number']}</span>
                <span>⏱ {row['Time In System (mins)']} min</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}