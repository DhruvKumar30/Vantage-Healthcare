import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useHospital } from '../context/HospitalContext';
import { fetchData } from '../api/apiService';

const card = { background: '#fff', borderRadius: 10, boxShadow: '0 2px 10px rgba(0,0,0,0.07)', padding: '20px 24px' };

export default function Dashboard() {
  const { selectedHospital } = useHospital();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true); setRows([]);
    fetchData('dashboard', selectedHospital.id)
      .then(data => { setRows(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [selectedHospital.id]);

  if (loading) return <div style={{ padding: 40 }}>Loading…</div>;
  if (!rows.length) return <div>No data.</div>;

  const latest = rows[rows.length - 1];
  const kpis = [
    { label: 'Bed Occupancy', value: `${latest['Bed Occupancy %']}%`, color: selectedHospital.color },
    { label: 'Patients Admitted', value: latest['Patients Admitted'], color: '#1B3A6B' },
    { label: 'Avg Wait Time', value: `${latest['Avg Wait Time (mins)']} min`, color: '#7B1FA2' },
    { label: 'Active Staff', value: latest['Active Staff On Shift'], color: '#2e7d32' },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 24, color: '#1a1a2e' }}>{selectedHospital.name} — Daily Snapshot</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        {kpis.map(k => (
          <div key={k.label} style={{ ...card, borderTop: `4px solid ${k.color}` }}>
            <div style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>{k.label}</div>
            <div style={{ fontSize: 30, fontWeight: 700, color: k.color }}>{k.value}</div>
          </div>
        ))}
      </div>
      <div style={card}>
        <div style={{ fontWeight: 600, marginBottom: 16 }}>Bed Occupancy % — Daily</div>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={rows}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="Date" tick={{ fontSize: 11 }} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="Bed Occupancy %" fill={selectedHospital.color} radius={[4,4,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div style={{ ...card, marginTop: 16 }}>
        <div style={{ fontWeight: 600, marginBottom: 16 }}>Admissions vs Discharges</div>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={rows}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="Date" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip /><Legend />
            <Bar dataKey="Patients Admitted" fill={selectedHospital.color} radius={[4,4,0,0]} />
            <Bar dataKey="Patients Discharged" fill="#82ca9d" radius={[4,4,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}