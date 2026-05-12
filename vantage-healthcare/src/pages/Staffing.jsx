import { useState, useEffect } from 'react';
import { useHospital } from '../context/HospitalContext';
import { fetchData } from '../api/apiService';

const card = { background: '#fff', borderRadius: 10, boxShadow: '0 2px 10px rgba(0,0,0,0.07)', padding: '20px 24px' };

const roleColors = {
  'Attending Physician':  '#1A7A6E',
  'Physician Assistant':  '#E65100',
  'RN':                   '#1B3A6B',
  'Lab Technician':       '#6D4C41',
  'Admin Coordinator':    '#00695C',
  'Patient Care Aide':    '#558B2F',
  'Charge Nurse':         '#C62828',
};

const shiftBadge = { Morning: '#fff8e1', Afternoon: '#e8f5e9', Night: '#ede7f6' };
const shiftText = { Morning: '#f57f17', Afternoon: '#2e7d32', Night: '#4527a0' };

export default function Staffing() {
  const { selectedHospital } = useHospital();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true); setRows([]);
    fetchData('staffing', selectedHospital.id)
      .then(data => { setRows(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [selectedHospital.id]);

  if (loading) return <div style={{ padding: 40 }}>Loading…</div>;
  if (!rows.length) return <div>No data.</div>;

  return (
    <div>
      <h2 style={{ marginBottom: 8, color: '#1a1a2e' }}>{selectedHospital.name} — Staffing</h2>
      <div style={{ color: '#888', marginBottom: 24, fontSize: 14 }}>{rows.length} staff members on record</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
        {rows.map((row, i) => (
          <div key={i} style={{ ...card, borderLeft: `4px solid ${roleColors[row['Role']] || '#999'}`, padding: '14px 18px' }}>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{row['Staff Name']}</div>
            <div style={{ fontSize: 13, color: roleColors[row['Role']] || '#555', fontWeight: 500, marginBottom: 10 }}>{row['Role']}</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <span style={{ background: shiftBadge[row['Shift']] || '#eee', color: shiftText[row['Shift']] || '#333', fontSize: 12, padding: '3px 10px', borderRadius: 20, fontWeight: 600 }}>
                {row['Shift']}
              </span>
              <span style={{ background: '#f0f4ff', color: '#1B3A6B', fontSize: 12, padding: '3px 10px', borderRadius: 20 }}>
                {row['Hours On Shift']}h shift
              </span>
              {row['Patients Assigned'] > 0 && (
                <span style={{ background: '#e8f5e9', color: '#2e7d32', fontSize: 12, padding: '3px 10px', borderRadius: 20 }}>
                  {row['Patients Assigned']} patients
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}