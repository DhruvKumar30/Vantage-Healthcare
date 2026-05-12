import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useHospital } from '../context/HospitalContext';
import { fetchData } from '../api/apiService';

const card = { background: '#fff', borderRadius: 10, boxShadow: '0 2px 10px rgba(0,0,0,0.07)', padding: '20px 24px' };

export default function Benchmarks() {
  const { selectedHospital } = useHospital();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true); setRows([]);
    fetchData('benchmarks', selectedHospital.id)
      .then(data => { setRows(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [selectedHospital.id]);

  if (loading) return <div style={{ padding: 40 }}>Loading…</div>;
  if (!rows.length) return <div>No data.</div>;

  const numericRows = rows.filter(r => typeof r['Department Value'] === 'number');

  return (
    <div>
      <h2 style={{ marginBottom: 24, color: '#1a1a2e' }}>{selectedHospital.name} — Benchmarks</h2>
      <div style={card}>
        <div style={{ fontWeight: 600, marginBottom: 16 }}>Department vs Industry Average</div>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={numericRows} layout="vertical" margin={{ left: 180, right: 30 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis type="number" tick={{ fontSize: 12 }} />
            <YAxis type="category" dataKey="Metric Name" tick={{ fontSize: 12 }} width={180} />
            <Tooltip />
            <Legend />
            <Bar dataKey="Department Value" fill={selectedHospital.color} radius={[0,4,4,0]} name="Our Dept" />
            <Bar dataKey="Industry Average" fill="#ccc" radius={[0,4,4,0]} name="Industry Avg" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginTop: 16 }}>
        {rows.map(row => {
          const dv = row['Department Value'];
          const ia = row['Industry Average'];
          const isNumeric = typeof dv === 'number';
          const better = isNumeric && (
            ['Readmission Rate (%)', 'Average Wait Time (mins)', 'Immune-Related Adverse Event Rate (%)', 'Time to Treatment Initiation (days)'].includes(row['Metric Name'])
              ? dv < ia : dv > ia
          );
          return (
            <div key={row['Metric Name']} style={{ ...card, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 20px' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{row['Metric Name']}</div>
                <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>{row['Source']}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: isNumeric ? (better ? '#2e7d32' : '#C62828') : selectedHospital.color }}>{String(dv)}</div>
                <div style={{ fontSize: 12, color: '#aaa' }}>Industry: {String(ia)}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}