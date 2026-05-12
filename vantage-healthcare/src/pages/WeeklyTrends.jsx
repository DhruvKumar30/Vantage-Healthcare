import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useHospital } from '../context/HospitalContext';
import { fetchData } from '../api/apiService';

const card = { background: '#fff', borderRadius: 10, boxShadow: '0 2px 10px rgba(0,0,0,0.07)', padding: '20px 24px' };

export default function WeeklyTrends() {
  const { selectedHospital } = useHospital();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true); setRows([]);
    fetchData('weekly', selectedHospital.id)
      .then(data => { setRows(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [selectedHospital.id]);

  if (loading) return <div style={{ padding: 40 }}>Loading…</div>;
  if (!rows.length) return <div>No data.</div>;

  const latest = rows[rows.length - 1];

  return (
    <div>
      <h2 style={{ marginBottom: 24, color: '#1a1a2e' }}>{selectedHospital.name} — Weekly Trends</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Bed Occupancy', value: `${latest['Bed Occupancy %']}%`, color: selectedHospital.color },
          { label: 'Patient Volume', value: latest['Patient Volume'], color: '#1B3A6B' },
          { label: 'Satisfaction Score', value: `${latest['Satisfaction Score']}/10`, color: '#2e7d32' },
        ].map(k => (
          <div key={k.label} style={{ ...card, borderTop: `4px solid ${k.color}` }}>
            <div style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>{k.label}</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: k.color }}>{k.value}</div>
          </div>
        ))}
      </div>
      <div style={card}>
        <div style={{ fontWeight: 600, marginBottom: 16 }}>Bed Occupancy & Patient Volume</div>
        <ResponsiveContainer width="100%" height={270}>
          <LineChart data={rows}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="Week Start Date" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip /><Legend />
            <Line type="monotone" dataKey="Bed Occupancy %" stroke={selectedHospital.color} strokeWidth={2} dot={{ r: 4 }} />
            <Line type="monotone" dataKey="Patient Volume" stroke="#82ca9d" strokeWidth={2} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div style={{ ...card, marginTop: 16 }}>
        <div style={{ fontWeight: 600, marginBottom: 16 }}>Satisfaction Score & Avg Wait Time</div>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={rows}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="Week Start Date" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip /><Legend />
            <Line type="monotone" dataKey="Satisfaction Score" stroke="#7B1FA2" strokeWidth={2} dot={{ r: 4 }} />
            <Line type="monotone" dataKey="Avg Wait Time (mins)" stroke="#C62828" strokeWidth={2} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}