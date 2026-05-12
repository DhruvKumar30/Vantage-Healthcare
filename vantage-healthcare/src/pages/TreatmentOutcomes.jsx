import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useHospital } from '../context/HospitalContext';
import { fetchData } from '../api/apiService';

const card = { background: '#fff', borderRadius: 10, boxShadow: '0 2px 10px rgba(0,0,0,0.07)', padding: '20px 24px' };

export default function TreatmentOutcomes() {
  const { selectedHospital } = useHospital();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true); setRows([]);
    fetchData('outcomes', selectedHospital.id)
      .then(data => { setRows(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [selectedHospital.id]);

  if (loading) return <div style={{ padding: 40 }}>Loading…</div>;
  if (!rows.length) return <div>No data.</div>;

  const avgORR = (rows.reduce((s, r) => s + r['Objective Response Rate %'], 0) / rows.length).toFixed(1);
  const avgIRAE = (rows.reduce((s, r) => s + r['irAE Rate %'], 0) / rows.length).toFixed(1);
  const totalPatients = rows.reduce((s, r) => s + r['Patients Treated'], 0);

  return (
    <div>
      <h2 style={{ marginBottom: 24, color: '#1a1a2e' }}>{selectedHospital.name} — Treatment Outcomes</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Avg Response Rate', value: `${avgORR}%`, color: '#2e7d32' },
          { label: 'Avg irAE Rate', value: `${avgIRAE}%`, color: '#C62828' },
          { label: 'Total Patients Treated', value: totalPatients, color: selectedHospital.color },
        ].map(k => (
          <div key={k.label} style={{ ...card, borderTop: `4px solid ${k.color}` }}>
            <div style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>{k.label}</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: k.color }}>{k.value}</div>
          </div>
        ))}
      </div>
      <div style={card}>
        <div style={{ fontWeight: 600, marginBottom: 16 }}>Objective Response Rate % by Condition</div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={rows} layout="vertical" margin={{ left: 180, right: 40 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12 }} />
            <YAxis type="category" dataKey="Condition Type" tick={{ fontSize: 11 }} width={180} />
            <Tooltip formatter={(v) => `${v}%`} />
            <Bar dataKey="Objective Response Rate %" radius={[0,4,4,0]}>
              {rows.map((row, i) => (
                <Cell key={i} fill={row['Objective Response Rate %'] >= 60 ? '#2e7d32' : row['Objective Response Rate %'] >= 45 ? selectedHospital.color : '#C62828'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div style={{ ...card, marginTop: 16 }}>
        <div style={{ fontWeight: 600, marginBottom: 16 }}>irAE Rate % by Condition</div>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={rows} layout="vertical" margin={{ left: 180, right: 40 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis type="number" tick={{ fontSize: 12 }} />
            <YAxis type="category" dataKey="Condition Type" tick={{ fontSize: 11 }} width={180} />
            <Tooltip formatter={(v) => `${v}%`} />
            <Bar dataKey="irAE Rate %" fill="#ef9a9a" radius={[0,4,4,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}