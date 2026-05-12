import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useHospital } from '../context/HospitalContext';
import { fetchData } from '../api/apiService';

const card = { background: '#fff', borderRadius: 10, boxShadow: '0 2px 10px rgba(0,0,0,0.07)', padding: '20px 24px' };

export default function PatientCareQuality() {
  const { selectedHospital } = useHospital();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true); setRows([]);
    fetchData('quality', selectedHospital.id)
      .then(data => { setRows(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [selectedHospital.id]);

  if (loading) return <div style={{ padding: 40 }}>Loading…</div>;
  if (!rows.length) return <div>No data.</div>;

  const latest = rows[rows.length - 1];

  return (
    <div>
      <h2 style={{ marginBottom: 24, color: '#1a1a2e' }}>{selectedHospital.name} — Patient Care Quality</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Satisfaction Score', value: `${latest['Satisfaction Score (out of 10)']}/10`, color: '#2e7d32' },
          { label: 'Readmission Rate', value: `${latest['Readmission Rate %']}%`, color: '#C62828' },
          { label: 'Avg Wait Time', value: `${latest['Avg Wait Time (mins)']} min`, color: selectedHospital.color },
        ].map(k => (
          <div key={k.label} style={{ ...card, borderTop: `4px solid ${k.color}` }}>
            <div style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>{k.label}</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: k.color }}>{k.value}</div>
          </div>
        ))}
      </div>
      <div style={card}>
        <div style={{ fontWeight: 600, marginBottom: 16 }}>Satisfaction Score Over Time</div>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={rows}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="Date" tick={{ fontSize: 11 }} />
            <YAxis domain={[7, 10]} tick={{ fontSize: 12 }} />
            <Tooltip />
            <Line type="monotone" dataKey="Satisfaction Score (out of 10)" stroke="#2e7d32" strokeWidth={2} dot={{ r: 3 }} name="Satisfaction Score" />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 16 }}>
        <div style={card}>
          <div style={{ fontWeight: 600, marginBottom: 16 }}>Readmission Rate %</div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={rows}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="Date" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Line type="monotone" dataKey="Readmission Rate %" stroke="#C62828" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div style={card}>
          <div style={{ fontWeight: 600, marginBottom: 16 }}>Avg Wait Time (mins)</div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={rows}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="Date" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Line type="monotone" dataKey="Avg Wait Time (mins)" stroke={selectedHospital.color} strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}