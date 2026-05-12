import { useHospital } from '../context/HospitalContext';

export default function HospitalSelector() {
  const { hospitals, selectedHospital, setSelectedHospital } = useHospital();

  return (
    <div>
      {hospitals.map(hospital => (
        <button
          key={hospital.id}
          onClick={() => setSelectedHospital(hospital)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '10px 14px',
            width: '100%',
            background: selectedHospital.id === hospital.id ? '#f0f4ff' : 'transparent',
            border: 'none',
            borderLeft: selectedHospital.id === hospital.id
              ? `4px solid ${hospital.color}`
              : '4px solid transparent',
            cursor: 'pointer',
            textAlign: 'left',
          }}
        >
          <span style={{
            width: 12, height: 12, borderRadius: '50%',
            background: hospital.color, flexShrink: 0
          }} />
          <div>
            <div style={{ fontWeight: 600, fontSize: 14 }}>{hospital.name}</div>
            <div style={{ fontSize: 12, color: '#666' }}>{hospital.city}</div>
          </div>
        </button>
      ))}
    </div>
  );
}