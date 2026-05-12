import { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useHospital } from '../context/HospitalContext';
import { fetchData } from '../api/apiService';

const card = { background: '#fff', borderRadius: 10, boxShadow: '0 2px 10px rgba(0,0,0,0.07)', padding: '20px 24px' };

export default function MonthlyTrends() {
  const { selectedHospital } = useHospital();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true); setRows([]);
    fetchData('monthly', selectedHospital.id)
      .then(data => { setRows(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [selectedHospital.id]);

  if (loading) return <div style={{ padding: 40 }}>Loading…</div>;
  if (!rows.length) return <div>No data.</div>;

  return (
    <div>
      <h2 style={{ marginBottom: 24, color: '#1a1a2e' }}>{selectedHospital.name} — Monthly Trends</h2>
      <div style={card}>
        <div style={{ fontWeight: 600, marginBottom: 16 }}>Bed Occupancy & Patient Volume</div>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={rows}>
            <defs>
              <linearGradient id="occGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={selectedHospital.color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={selectedHospital.color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="Month" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip /><Legend />
            <Area type="monotone" dataKey="Bed Occupancy %" stroke={selectedHospital.color} fill="url(#occGrad)" strokeWidth={2} />
            <Area type="monotone" dataKey="Patient Volume" stroke="#82ca9d" fill="none" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 16 }}>
        <div style={card}>
          <div style={{ fontWeight: 600, marginBottom: 16 }}>Satisfaction Score</div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={rows}>
              <defs>
                <linearGradient id="satGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7B1FA2" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#7B1FA2" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="Month" tick={{ fontSize: 10 }} />
              <YAxis domain={[7, 10]} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Area type="monotone" dataKey="Satisfaction Score" stroke="#7B1FA2" fill="url(#satGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div style={card}>
          <div style={{ fontWeight: 600, marginBottom: 16 }}>Readmission Rate %</div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={rows}>
              <defs>
                <linearGradient id="readGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#C62828" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#C62828" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="Month" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Area type="monotone" dataKey="Readmission Rate %" stroke="#C62828" fill="url(#readGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}