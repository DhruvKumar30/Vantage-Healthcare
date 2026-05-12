import hospitalData from '../data/hospitalData';

const pageMap = {
  dashboard: 'dashboard',
  weekly: 'weekly',
  monthly: 'monthly',
  benchmarks: 'benchmarks',
  staffing: 'staffing',
  quality: 'quality',
  outcomes: 'outcomes',
  flow: 'flow',
  alerts: 'alerts',
};

export async function fetchData(page, hospitalId) {
  return new Promise((resolve, reject) => {
    const hospitalPages = hospitalData[hospitalId];
    if (!hospitalPages) return reject(new Error(`Unknown hospital: ${hospitalId}`));
    const data = hospitalPages[pageMap[page]];
    if (!data) return reject(new Error(`No data for page: ${page}`));
    resolve(data);
  });
}