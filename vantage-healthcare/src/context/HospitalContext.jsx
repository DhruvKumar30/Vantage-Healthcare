import { createContext, useContext, useState } from 'react';

const allHospitals = [
  { id: 'desert_regional',    name: 'Desert Regional Medical Center', city: 'Palm Springs, CA',  department: 'Cancer Immunology', color: '#1A7A6E' },
  { id: 'redlands_community', name: 'Redlands Community Hospital',    city: 'Redlands, CA',      department: 'Cancer Immunology', color: '#1B3A6B' },
  { id: 'jfk_memorial',       name: 'JFK Memorial Hospital',          city: 'Indio, CA',          department: 'Cancer Immunology', color: '#7B1FA2' },
  { id: 'san_gorgonio',       name: 'San Gorgonio Memorial Hospital', city: 'Banning, CA',        department: 'Cancer Immunology', color: '#C62828' },
];

const HospitalContext = createContext(null);

export function HospitalProvider({ children, hospitalAccess }) {
  const hospitals = hospitalAccess === 'all'
    ? allHospitals
    : allHospitals.filter(h => h.id === hospitalAccess);

  const savedId = localStorage.getItem('selectedHospitalId');
  const initial = hospitals.find(h => h.id === savedId) || hospitals[0];
  const [selectedHospital, setSelectedHospitalState] = useState(initial);

  function setSelectedHospital(hospital) {
    localStorage.setItem('selectedHospitalId', hospital.id);
    setSelectedHospitalState(hospital);
  }

  return (
    <HospitalContext.Provider value={{ selectedHospital, setSelectedHospital, hospitals }}>
      {children}
    </HospitalContext.Provider>
  );
}

export function useHospital() {
  return useContext(HospitalContext);
}